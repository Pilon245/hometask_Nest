import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/update.blogs.dto';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';

export class BanBlogCommand {
  constructor(public banUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(private blogsRepository: BlogsOrmRepository) {}

  async execute(command: BanBlogCommand) {
    const banBlogs = new BanBlogsFactory(
      command.banUseCaseDto.id,
      command.banUseCaseDto.isBanned,
      new Date().toISOString(),
    );
    return this.blogsRepository.banBlogs(banBlogs);
  }
}
