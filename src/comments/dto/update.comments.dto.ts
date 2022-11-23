import { LikeValueComment } from '../entities/likes.comments.entity';
import { Length } from 'class-validator';

export class UpdateCommentInputModel {
  @Length(20, 300)
  content: string;
}
