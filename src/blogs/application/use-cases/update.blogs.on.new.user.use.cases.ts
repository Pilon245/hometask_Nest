import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import {
  UpdateBlogOnNewUser,
  UpdateBlogOnNewUserCommandUseCaseDto,
  UpdateBlogOnNewUserRepo,
} from '../../dto/update.blogs.dto';

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
