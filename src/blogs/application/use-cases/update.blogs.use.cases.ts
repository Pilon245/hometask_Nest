import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  UpdateBlogUseCaseDto,
  UpdateBlogInputModelType,
} from '../../domain/dto/update.blogs.dto';
import { BlogsSqlRepository } from '../../infrastructure/blogs.sql.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';

export class UpdateBlogCommand {
  constructor(public updateUseCaseDto: UpdateBlogUseCaseDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsOrmRepository) {}

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
