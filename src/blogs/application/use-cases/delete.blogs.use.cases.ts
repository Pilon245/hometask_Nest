import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogsUseCaseDto } from '../../domain/dto/createBlogsDto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BlogsFactory } from '../../domain/dto/blogsFactory';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    return this.blogsRepository.deleteBlogs(command.id);
  }
}
