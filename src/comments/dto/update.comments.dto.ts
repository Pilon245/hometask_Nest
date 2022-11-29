import { LikeValueComment } from '../entities/likes.comments.entity';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { LikeValuePost } from '../../posts/entities/likes.posts.entity';

export class UpdateCommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}

export class UpdateCommentLikeInputModel {
  @IsNotEmpty()
  @IsEnum(LikeValueComment)
  // @Transform(({ value }: TransformFnParams) => value?.trim())
  // @Length(1, 7) //todo седать валидацию лайков
  likeStatus: LikeValueComment;
}
