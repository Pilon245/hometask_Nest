import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogsUseCaseDto } from '../../domain/dto/createBlogsDto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BlogsFactory } from '../../domain/dto/blogsFactory';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';

export class CreateBlogsCommand {
  constructor(public createUseCaseDto: CreateBlogsUseCaseDto) {}
}

@CommandHandler(CreateBlogsCommand)
export class CreateBlogsUseCase implements ICommandHandler<CreateBlogsCommand> {
  constructor(
    private blogsRepository: BlogsOrmRepository,
    private usersRepository: UsersOrmRepository,
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
    await this.blogsRepository.createBlogs(newBlog);
    return newBlog;
  }
}
