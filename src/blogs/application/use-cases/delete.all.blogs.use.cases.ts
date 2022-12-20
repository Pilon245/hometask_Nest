import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import { BlogsFactory } from '../../dto/blogsFactory';

export class DeleteBlogsCommand {}

@CommandHandler(DeleteBlogsCommand)
export class DeleteBlogsUseCase implements ICommandHandler<DeleteBlogsCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
