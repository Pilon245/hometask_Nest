import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import { BlogsFactory } from '../../dto/blogsFactory';

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
