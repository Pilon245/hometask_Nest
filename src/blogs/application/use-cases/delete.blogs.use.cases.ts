import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsOrmRepository) {}

  async execute(command: DeleteBlogCommand) {
    return this.blogsRepository.deleteBlogs(command.id);
  }
}
