import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { CreatePostUseCaseDto, PostsFactory } from '../../dto/postsFactory';
import { LikeValuePost } from '../../entities/likes.posts.entity';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../posts.repository';
import {
  UpdatePostDTO,
  UpdatePostUseCaseDTO,
} from '../../dto/update.posts.dto';

export class UpdatePostCommand {
  constructor(public updateUseCaseDto: UpdatePostUseCaseDTO) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

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
