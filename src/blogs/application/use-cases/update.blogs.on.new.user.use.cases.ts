import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import { BlogsFactory } from '../../dto/blogsFactory';
import { UpdateBlogOnNewUserRepo } from '../../dto/update.blogs.dto';

export class UpdateBlogOnNewUserCommand {
  constructor(public updateUseCaseDto: UpdateBlogOnNewUserCommandUseCaseDto) {}
}

@CommandHandler(UpdateBlogOnNewUserCommand)
export class UpdateBlogOnNewUserUseCase
  implements ICommandHandler<UpdateBlogOnNewUserCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdateBlogOnNewUserCommand) {
    const user = await this.usersRepository.findUsersById(command.userId);
    const updateBlog: UpdateBlogOnNewUserRepo = {
      id: command.id,
      userId: command.userId,
      userLogin: user.accountData.login,
    };
    return this.blogsRepository.updateBlogsOnNewUser(updateBlog);
  }
}
