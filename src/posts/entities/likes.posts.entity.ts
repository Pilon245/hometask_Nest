import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { extendedLikesInfoType } from '../posts.service';

export type LikePostDocument = HydratedDocument<LikePost>;

@Schema()
export class LikePost {
  @Prop()
  likesStatus: number;
  @Prop()
  dislikesStatus: number;
  // @Prop({ type: LikeValueSchema })//todo  тут переделать
  // myStatus: LikeValuePost;
  @Prop()
  myStatus: string;
  @Prop()
  userId: string;
  @Prop()
  postId: string;
  @Prop()
  login: string;
  @Prop()
  addedAt: string;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);

export enum LikeValuePost {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
