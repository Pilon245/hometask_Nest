import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteBlogsCommand {}

@CommandHandler(DeleteBlogsCommand)
export class DeleteBlogsUseCase implements ICommandHandler<DeleteBlogsCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
