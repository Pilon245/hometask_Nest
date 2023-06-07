import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreatePostUseCaseDto,
  PostsFactory,
} from '../../domain/dto/postsFactory';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/blogs.sql.repository';
import { PostsSqlRepository } from '../../infrastructure/posts.sql.repository';
import { BlogsOrmRepository } from 'src/blogs/infrastructure/blogs.orm.repository';
import { PostsOrmRepository } from 'src/posts/infrastructure/posts.orm.repository';

export class CreatePostCommand {
  constructor(public createUseCaseDto: CreatePostUseCaseDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostsUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsOrmRepository,
    private postsRepository: PostsOrmRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogsRepository.findBlogById(
      command.createUseCaseDto.blogId,
    );
    const newPost = new PostsFactory(
      String(+new Date()),
      command.createUseCaseDto.title,
      command.createUseCaseDto.shortDescription,
      command.createUseCaseDto.content,
      command.createUseCaseDto.blogId,
      blog.name,
      new Date().toISOString(),
      false,
      command.createUseCaseDto.userId,
    );
    return this.postsRepository.createPosts(newPost);
  }
}
