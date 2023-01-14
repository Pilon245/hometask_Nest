import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/update.blogs.dto';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';

export class BanBlogCommand {
  constructor(public banUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(private blogsRepository: BlogsSqlRepository) {}

  async execute(command: BanBlogCommand) {
    const banBlogs = new BanBlogsFactory(
      command.banUseCaseDto.id,
      command.banUseCaseDto.isBanned,
      new Date().toISOString(),
    );
    return this.blogsRepository.banBlogs(banBlogs);
  }
}
