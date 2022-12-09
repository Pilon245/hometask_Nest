import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  BanUserInputModel,
  BanUsersFactory,
  CreateUserInputModel,
  UsersFactory,
} from './dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { _generatePasswordForDb } from '../helper/auth.function';
import { SessionService } from '../session/session.service';
import { BlogsRepository } from '../blogs/blogs.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    protected sessionService: SessionService,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
  ) {}
  async createUsers(inputModel: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    const newUser = new UsersFactory(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    );
    await this.userRepository.createUsers(newUser);
    return newUser;
  }
  async updateUsers(id: string, inputModel: BanUserInputModel) {
    if (inputModel.isBanned) {
      const newUser = new BanUsersFactory(
        id,
        inputModel.isBanned,
        new Date().toISOString(),
        inputModel.banReason,
      );
      console.log('newUser', newUser);
      const blog = await this.blogsRepository.findBlogByUserId(newUser.id);
      const blogId = blog.id;
      await this.sessionService.deleteUserDevices(id);
      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);

      return newUser;
    } else {
      const newUser = new BanUsersFactory(id, false, null, null);
      console.log('newUser', newUser);
      await this.userRepository.updateUsers(newUser);
      return newUser;
    }
  }
  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
  async deleteAllUsers() {
    return await this.userRepository.deleteAllUsers();
  }
}
