import { LikeValueComment } from '../entities/likes.comments.entity';
import { Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateCommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}

export class UpdateLikeInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 7) //todo седать валидацию лайков
  likeStatus: string;
}
