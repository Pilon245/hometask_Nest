import { LikeValueComment } from '../entities/likes.comments.entity';
import { Length } from 'class-validator';

export class UpdateCommentInputModel {
  @Length(20, 300)
  content: string;
}

export class UpdateLikeInputModel {
  @Length(0, 7)
  likeStatus: string;
}
