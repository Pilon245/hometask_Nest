import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  BanBloggerUsersFactory,
  BanBLoggerUsersInputModel,
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

      await this.sessionService.deleteUserDevices(newUser.id);
      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);

      return newUser;
    } else {
      const newUser = new BanUsersFactory(id, inputModel.isBanned, null, null);

      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);

      return newUser;
    }
  }
  async banBloggerUsers(
    banUserId: string,
    bloggerId: string,
    model: BanBLoggerUsersInputModel,
  ) {
    const user = await this.userRepository.findUsersById(banUserId);
    if (!user) return false;
    const banUser = await this.userRepository.findBanBloggerUsersDB(
      banUserId,
      model.blogId,
    );
    if (!banUser) {
      const newBanUser = new BanBloggerUsersFactory(
        banUserId,
        model.blogId,
        bloggerId,
        user.accountData.login,
        {
          isBanned: model.isBanned,
          banDate: new Date().toISOString(),
          banReason: model.banReason,
        },
      );

      await this.userRepository.banBloggerUsers(newBanUser);

      return newBanUser;
    } else {
      const banDate = new Date().toISOString();
      await this.userRepository.updateBanBloggerUsers(
        banUserId,
        bloggerId,
        model.blogId,
        model.isBanned,
        banDate,
        model.banReason,
      );
      return true;
    }
  }
  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
  async deleteAllUsers() {
    return await this.userRepository.deleteAllUsers();
  }
}
