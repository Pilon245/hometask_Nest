import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogsUseCaseDto } from '../../domain/dto/createBlogsDto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BlogsFactory } from '../../domain/dto/blogsFactory';

export class DeleteBlogsCommand {}

@CommandHandler(DeleteBlogsCommand)
export class DeleteBlogsUseCase implements ICommandHandler<DeleteBlogsCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
