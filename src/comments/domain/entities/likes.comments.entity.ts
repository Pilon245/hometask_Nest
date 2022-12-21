import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeCommentDocument = HydratedDocument<LikeComment>;

@Schema()
export class LikeComment {
  @Prop()
  likesStatus: number;
  @Prop()
  dislikesStatus: number;
  @Prop()
  myStatus: LikeValueComment;
  @Prop()
  userId: string;
  @Prop()
  commentId: string;
  @Prop()
  isBanned: boolean;
}

export const LikeCommentSchema = SchemaFactory.createForClass(LikeComment);

export enum LikeValueComment {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
