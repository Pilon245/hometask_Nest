import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import {
  BanBloggerUserUseCaseDto,
  BanBloggerUsersFactory,
} from '../../domain/dto/usersFactory';
import { SessionRepository } from '../../../session/infrastructure/session.repository';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class BanBloggerUserCommand {
  constructor(public banBloggerUserUseCase: BanBloggerUserUseCaseDto) {}
}

@CommandHandler(BanBloggerUserCommand)
export class BanBloggerUserUseCase
  implements ICommandHandler<BanBloggerUserCommand>
{
  constructor(private usersRepository: UsersRepository) {}

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
