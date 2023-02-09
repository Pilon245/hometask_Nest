import { LikeValueComment } from '../entities/nosql/likes.comments.entity';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentInputModel {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}

export class UpdateCommentLikeInputModel {
  @ApiProperty({ enum: ['None', 'Like', 'Dislike'] })
  @IsNotEmpty()
  @IsEnum(LikeValueComment)
  likeStatus: LikeValueComment;
}
export class UpdateLikeCommentUseCaseDto {
  userId: string;
  commentId: string;
  value: string;
}
