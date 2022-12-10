import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeValueComment } from './likes.comments.entity';

export type CommentDocument = HydratedDocument<Comment>;
@Schema()
export class likesInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValueComment;
}
export const likesInfoSchema = SchemaFactory.createForClass(likesInfoType);

@Schema()
export class commentatorInfoType {
  userId: string;
  userLogin: string;
}
export const commentatorInfoSchema =
  SchemaFactory.createForClass(commentatorInfoType);

@Schema()
export class postInfoType {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
}
export const postInfoSchema = SchemaFactory.createForClass(postInfoType);

@Schema()
export class Comment {
  @Prop({ require: true })
  id: string;

  @Prop({ require: true })
  content: string;

  @Prop({ require: true })
  userId: string;

  @Prop({ require: true })
  userLogin: string;

  @Prop({ require: true })
  postId: string;

  @Prop({ require: true })
  createdAt: string;

  @Prop({ type: likesInfoSchema })
  likesInfo: likesInfoType;

  @Prop({ type: commentatorInfoSchema })
  commentatorInfo: commentatorInfoType;

  @Prop({ type: postInfoSchema })
  postInfo: postInfoType;

  @Prop()
  isBan: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
