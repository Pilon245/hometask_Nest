import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import {
  BanUsersFactory,
  BanBloggerUserUseCaseDto,
  CreateUserUseCaseDto,
  UsersFactory,
  BanAdminUserUseCaseDto,
} from '../../dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { SessionRepository } from '../../../session/session.repository';
import { CommentsRepository } from '../../../comments/comments.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { BlogsRepository } from '../../../blogs/blogs.repository';

export class BanAdminUserCommand {
  constructor(public banAdminUserUseCase: BanAdminUserUseCaseDto) {}
}

@CommandHandler(BanAdminUserCommand)
export class BanAdminUserUseCase
  implements ICommandHandler<BanAdminUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(command: BanAdminUserCommand) {
    if (command.banAdminUserUseCase.isBanned) {
      const newUser = new BanUsersFactory(
        command.banAdminUserUseCase.id,
        command.banAdminUserUseCase.isBanned,
        new Date().toISOString(),
        command.banAdminUserUseCase.banReason,
      );

      await this.sessionRepository.deleteUserDevices(newUser.id);
      await this.usersRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );
      await this.postsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );
      await this.commentsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );

      return newUser;
    } else {
      const newUser = new BanUsersFactory(
        command.banAdminUserUseCase.id,
        command.banAdminUserUseCase.isBanned,
        null,
        null,
      );

      await this.usersRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );
      await this.postsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );
      await this.commentsRepository.banUsers(
        newUser.id,
        command.banAdminUserUseCase.isBanned,
      );

      return newUser;
    }
  }
}
