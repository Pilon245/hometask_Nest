import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  CreatePostUseCaseDto,
  PostsFactory,
} from '../../domain/dto/postsFactory';
import { LikeValuePost } from '../../domain/entities/nosql/likes.posts.entity';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import {
  UpdatePostDTO,
  UpdatePostUseCaseDTO,
} from '../../domain/dto/update.posts.dto';
import { PostsSqlRepository } from '../../infrastructure/posts.sql.repository';

export class UpdatePostCommand {
  constructor(public updateUseCaseDto: UpdatePostUseCaseDTO) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsSqlRepository) {}

  async execute(command: UpdatePostCommand) {
    const updatePost: UpdatePostDTO = {
      id: command.updateUseCaseDto.postId,
      title: command.updateUseCaseDto.title,
      shortDescription: command.updateUseCaseDto.shortDescription,
      content: command.updateUseCaseDto.content,
      blogId: command.updateUseCaseDto.blogId,
    };
    return this.postsRepository.updatePosts(updatePost);
  }
}
