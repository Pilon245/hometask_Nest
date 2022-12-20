import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs.repository';
import { CreateBlogsUseCaseDto } from '../../dto/createBlogsDto';
import { UsersRepository } from '../../../users/users.repository';
import { BlogsFactory } from '../../dto/blogsFactory';
import {
  UpdateBlogUseCaseDto,
  UpdateBlogInputModelType,
} from '../../dto/update.blogs.dto';

export class UpdateBlogCommand {
  constructor(public updateUseCaseDto: UpdateBlogUseCaseDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand) {
    const updateBlog: UpdateBlogInputModelType = {
      id: command.updateUseCaseDto.id,
      name: command.updateUseCaseDto.name,
      description: command.updateUseCaseDto.description,
      websiteUrl: command.updateUseCaseDto.websiteUrl,
    };
    return this.blogsRepository.updateBlogs(updateBlog);
  }
}
