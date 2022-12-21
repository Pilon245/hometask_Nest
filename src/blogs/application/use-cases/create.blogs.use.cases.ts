import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import { BlogsFactory } from '../../dto/blogsFactory';

export class CreateBlogsCommand {
  constructor(public createUseCaseDto: CreateBlogsUseCaseDto) {}
}

@CommandHandler(CreateBlogsCommand)
export class CreateBlogsUseCase implements ICommandHandler<CreateBlogsCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateBlogsCommand) {
    const user = await this.usersRepository.findUsersById(
      command.createUseCaseDto.userId,
    );
    const newBlog = new BlogsFactory(
      String(+new Date()),
      command.createUseCaseDto.name,
      command.createUseCaseDto.description,
      command.createUseCaseDto.websiteUrl,
      new Date().toISOString(),
      {
        userId: user.id,
        userLogin: user.accountData.login,
      },
      {
        isBanned: false,
        banDate: null,
      },
    );
    return this.blogsRepository.createBlogs(newBlog);
  }
}
