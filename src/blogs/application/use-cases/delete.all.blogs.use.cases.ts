import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';

export class DeleteBlogsCommand {}

@CommandHandler(DeleteBlogsCommand)
export class DeleteBlogsUseCase implements ICommandHandler<DeleteBlogsCommand> {
  constructor(private blogsRepository: BlogsOrmRepository) {}

  async execute() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
