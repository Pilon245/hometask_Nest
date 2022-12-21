import { LikeValueComment } from '../entities/likes.comments.entity';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateCommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}

export class UpdateCommentLikeInputModel {
  @IsNotEmpty()
  @IsEnum(LikeValueComment)
  likeStatus: LikeValueComment;
}
export class UpdateLikeCommentUseCaseDto {
  userId: string;
  commentId: string;
  value: string;
}
