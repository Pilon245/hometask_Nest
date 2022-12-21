import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/update.blogs.dto';

export class BanBlogCommand {
  constructor(public banUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: BanBlogCommand) {
    const banBlogs = new BanBlogsFactory(
      command.banUseCaseDto.id,
      command.banUseCaseDto.isBanned,
      new Date().toISOString(),
    );
    return this.blogsRepository.banBlogs(banBlogs);
  }
}
