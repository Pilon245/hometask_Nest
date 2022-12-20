import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeValuePost } from './likes.posts.entity';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class newestLikesType {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}
@Schema()
export class extendedLikesInfoType {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  myStatus: LikeValuePost;
  @Prop()
  newestLikes: newestLikesType[];
}
const extendedLikesInfoSchema = SchemaFactory.createForClass(
  extendedLikesInfoType,
);

@Schema()
export class Post {
  @Prop({ require: true })
  id: string;

  @Prop({ require: true })
  title: string;

  @Prop({ require: true })
  shortDescription: string;

  @Prop({ require: true })
  content: string;

  @Prop({ require: true })
  blogId: string;

  @Prop({ require: true })
  blogName: string;

  @Prop({ require: true })
  createdAt: string;

  @Prop({ type: extendedLikesInfoSchema })
  extendedLikesInfo: extendedLikesInfoType;
  @Prop()
  isBan: boolean;
  @Prop({ require: true }) //todo можно убрать
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
