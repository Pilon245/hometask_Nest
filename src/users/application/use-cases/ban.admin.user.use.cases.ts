import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import {
  BanUsersFactory,
  BanAdminUserUseCaseDto,
} from '../../domain/dto/usersFactory';
import { SessionRepository } from '../../../session/infrastructure/session.repository';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { UsersSqlRepository } from '../../infrastructure/users.sql.repository';
import { SessionSqlRepository } from '../../../session/infrastructure/session.sql.repository';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/blogs.sql.repository';
import { PostsSqlRepository } from '../../../posts/infrastructure/posts.sql.repository';
import { CommentsSqlRepository } from '../../../comments/infrastructure/comments.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';
import { PostsOrmRepository } from 'src/posts/infrastructure/posts.orm.repository';
import { CommentsOrmRepository } from 'src/comments/infrastructure/comments.orm.repository';
import { SessionOrmRepository } from 'src/session/infrastructure/session.orm.repository';

export class BanAdminUserCommand {
  constructor(public banAdminUserUseCase: BanAdminUserUseCaseDto) {}
}

@CommandHandler(BanAdminUserCommand)
export class BanAdminUserUseCase
  implements ICommandHandler<BanAdminUserCommand>
{
  constructor(
    private usersRepository: UsersOrmRepository,
    private blogsRepository: BlogsOrmRepository,
    private postsRepository: PostsOrmRepository,
    private commentsRepository: CommentsOrmRepository,
    private sessionRepository: SessionOrmRepository,
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
