import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';

export class DeleteBlogsCommand {}

@CommandHandler(DeleteBlogsCommand)
export class DeleteBlogsUseCase implements ICommandHandler<DeleteBlogsCommand> {
  constructor(private blogsRepository: BlogsSqlRepository) {}

  async execute() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
