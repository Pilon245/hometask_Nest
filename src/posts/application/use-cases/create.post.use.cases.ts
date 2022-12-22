import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CreatePostUseCaseDto, PostsFactory } from '../../domain/dto/postsFactory';
import { LikeValuePost } from '../../domain/entities/likes.posts.entity';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public createUseCaseDto: CreatePostUseCaseDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostsUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
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