import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikePostDocument = HydratedDocument<LikePost>;

@Schema()
export class LikePost {
  @Prop()
  likesStatus: number;
  @Prop()
  dislikesStatus: number;
  @Prop()
  myStatus: LikeValuePost;
  @Prop()
  userId: string;
  @Prop()
  postId: string;
  @Prop()
  login: string;
  @Prop()
  addedAt: string;
  @Prop()
  isBanned: boolean;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);

export enum LikeValuePost {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
