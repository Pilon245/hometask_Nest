import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { CreatePostUseCaseDto, PostsFactory } from '../../dto/postsFactory';
import { LikeValuePost } from '../../entities/likes.posts.entity';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../posts.repository';

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
