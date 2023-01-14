import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  UpdateBlogOnNewUserCommandUseCaseDto,
  UpdateBlogOnNewUserRepo,
} from '../../domain/dto/update.blogs.dto';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';

export class UpdateBlogOnNewUserCommand {
  constructor(public updateUseCaseDto: UpdateBlogOnNewUserCommandUseCaseDto) {}
}

@CommandHandler(UpdateBlogOnNewUserCommand)
export class UpdateBlogOnNewUserUseCase
  implements ICommandHandler<UpdateBlogOnNewUserCommand>
{
  constructor(
    private blogsRepository: BlogsSqlRepository,
    private usersRepository: UsersSqlRepository,
  ) {}

  async execute(command: UpdateBlogOnNewUserCommand) {
    const user = await this.usersRepository.findUsersById(
      command.updateUseCaseDto.userId,
    );
    const updateBlog: UpdateBlogOnNewUserRepo = {
      id: command.updateUseCaseDto.id,
      userId: command.updateUseCaseDto.userId,
      userLogin: user.accountData.login,
    };
    return this.blogsRepository.updateBlogsOnNewUser(updateBlog);
  }
}
