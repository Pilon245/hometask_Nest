import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import {
  CreatePostUseCaseDto,
  LikesPostFactory,
  PostsFactory,
} from '../../dto/postsFactory';
import { LikeValuePost } from '../../entities/likes.posts.entity';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../posts.repository';
import {
  UpdateLikePostUseCaseDTO,
  UpdatePostDTO,
  UpdatePostUseCaseDTO,
} from '../../dto/update.posts.dto';

export class UpdateLikePostCommand {
  constructor(public updateUseCaseDto: UpdateLikePostUseCaseDTO) {}
}

@CommandHandler(UpdateLikePostCommand)
export class UpdateLikePostUseCase
  implements ICommandHandler<UpdateLikePostCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: UpdateLikePostCommand) {
    const user = await this.postsRepository.findLikeByIdAndPostId(
      command.updateUseCaseDto.userId,
      command.updateUseCaseDto.postId,
    );
    if (!user) {
      if (command.updateUseCaseDto.value === LikeValuePost.like) {
        const newLike = new LikesPostFactory(
          1,
          0,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.postId,
          command.updateUseCaseDto.login,
          new Date().toISOString(),
          false,
        );
        return await this.postsRepository.createLike(newLike);
      }
      if (command.updateUseCaseDto.value === LikeValuePost.dislike) {
        const newLike = new LikesPostFactory(
          0,
          1,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.postId,
          command.updateUseCaseDto.login,
          new Date().toISOString(),
          false,
        );
        return await this.postsRepository.createLike(newLike);
      }
      if (command.updateUseCaseDto.value === LikeValuePost.none) {
        const newLike = new LikesPostFactory(
          0,
          0,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.postId,
          command.updateUseCaseDto.login,
          new Date().toISOString(),
          false,
        );
        return await this.postsRepository.createLike(newLike);
      }
    }
    if (
      command.updateUseCaseDto.value === LikeValuePost.like &&
      user.likesStatus === 0
    ) {
      const likesStatus = 1;
      const dislikesStatus = 0;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const post = command.updateUseCaseDto.postId;
      const loginUser = command.updateUseCaseDto.login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }
    if (
      command.updateUseCaseDto.value === LikeValuePost.dislike &&
      user.dislikesStatus === 0
    ) {
      const likesStatus = 0;
      const dislikesStatus = 1;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const post = command.updateUseCaseDto.postId;
      const loginUser = command.updateUseCaseDto.login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }

    if (command.updateUseCaseDto.value === LikeValuePost.none) {
      const likesStatus = 0;
      const dislikesStatus = 0;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const post = command.updateUseCaseDto.postId;
      const loginUser = command.updateUseCaseDto.login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }
    return false;
  }
}
