import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import {
  BanUsersFactory,
  BanBloggerUserUseCaseDto,
  CreateUserUseCaseDto,
  UsersFactory,
  BanBloggerUsersFactory,
} from '../../dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { SessionRepository } from '../../../session/session.repository';
import { CommentsRepository } from '../../../comments/comments.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { BlogsRepository } from '../../../blogs/blogs.repository';

export class BanBloggerUserCommand {
  constructor(public banBloggerUserUseCase: BanBloggerUserUseCaseDto) {}
}

@CommandHandler(BanBloggerUserCommand)
export class BanBloggerUserUseCase
  implements ICommandHandler<BanBloggerUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(command: BanBloggerUserCommand) {
    const user = await this.usersRepository.findUsersById(
      command.banBloggerUserUseCase.banUserId,
    );
    if (!user) return false;
    const banUser = await this.usersRepository.findBanBloggerUsersDB(
      command.banBloggerUserUseCase.banUserId,
      command.banBloggerUserUseCase.blogId,
    );
    if (!banUser) {
      const newBanUser = new BanBloggerUsersFactory(
        command.banBloggerUserUseCase.banUserId,
        command.banBloggerUserUseCase.blogId,
        command.banBloggerUserUseCase.bloggerId,
        user.accountData.login,
        {
          isBanned: command.banBloggerUserUseCase.isBanned,
          banDate: new Date().toISOString(),
          banReason: command.banBloggerUserUseCase.banReason,
        },
      );

      await this.usersRepository.banBloggerUsers(newBanUser);

      return newBanUser;
    } else {
      const banDate = new Date().toISOString();
      await this.usersRepository.updateBanBloggerUsers(
        command.banBloggerUserUseCase.banUserId,
        command.banBloggerUserUseCase.bloggerId,
        command.banBloggerUserUseCase.blogId,
        command.banBloggerUserUseCase.isBanned,
        banDate,
        command.banBloggerUserUseCase.banReason,
      );
      return true;
    }
  }
}
