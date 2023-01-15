import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesFactory } from '../../domain/dto/commentsFactory';
import { LikeValueComment } from '../../domain/entities/likes.comments.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UpdateLikeCommentUseCaseDto } from '../../domain/dto/update.comments.dto';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';

export class UpdateLikeCommentCommand {
  constructor(public updateUseCaseDto: UpdateLikeCommentUseCaseDto) {}
}

@CommandHandler(UpdateLikeCommentCommand)
export class UpdateLikeCommentUseCase
  implements ICommandHandler<UpdateLikeCommentCommand>
{
  constructor(private commentsRepository: CommentsSqlRepository) {}

  async execute(command: UpdateLikeCommentCommand) {
    const user = await this.commentsRepository.findLikeByIdAndCommentId(
      command.updateUseCaseDto.userId,
      command.updateUseCaseDto.commentId,
    );
    if (!user) {
      if (command.updateUseCaseDto.value === LikeValueComment.like) {
        const newLike = new LikesFactory(
          1,
          0,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.commentId,
          false,
        );
        return await this.commentsRepository.createLike(newLike);
      }
      if (command.updateUseCaseDto.value === LikeValueComment.dislike) {
        const newLike = new LikesFactory(
          0,
          1,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.commentId,
          false,
        );
        return await this.commentsRepository.createLike(newLike);
      }
      if (command.updateUseCaseDto.value === LikeValueComment.none) {
        const newLike = new LikesFactory(
          0,
          0,
          command.updateUseCaseDto.value,
          command.updateUseCaseDto.userId,
          command.updateUseCaseDto.commentId,
          false,
        );
        return await this.commentsRepository.createLike(newLike);
      }
    }
    if (
      command.updateUseCaseDto.value === LikeValueComment.like &&
      user.likesStatus === 0
    ) {
      const likesStatus = 1;
      const dislikesStatus = 0;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const comment = command.updateUseCaseDto.commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (
      command.updateUseCaseDto.value === LikeValueComment.dislike &&
      user.dislikesStatus === 0
    ) {
      const likesStatus = 0;
      const dislikesStatus = 1;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const comment = command.updateUseCaseDto.commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (command.updateUseCaseDto.value === LikeValueComment.none) {
      const likesStatus = 0;
      const dislikesStatus = 0;
      const myStatus = command.updateUseCaseDto.value;
      const authUserId = command.updateUseCaseDto.userId;
      const comment = command.updateUseCaseDto.commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    return false;
  }
}
