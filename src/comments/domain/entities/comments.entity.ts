import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeValueComment } from './likes.comments.entity';

export type CommentDocument = HydratedDocument<Comment>;

// @Schema({ id: false })
// export class likesInfoType {
//   likesCount: number;
//   dislikesCount: number;
//   myStatus: LikeValueComment;
// }
// export const likesInfoSchema = SchemaFactory.createForClass(likesInfoType);

@Schema({ id: false })
export class commentatorInfoType {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}
export const commentatorInfoSchema =
  SchemaFactory.createForClass(commentatorInfoType);

@Schema({ id: false })
export class postInfoType {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
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
  postId: string;

  @Prop({ require: true })
  createdAt: string;

  // @Prop({ type: likesInfoSchema }) //todo убрать
  // likesInfo: likesInfoType;

  @Prop({ type: commentatorInfoSchema })
  commentatorInfo: commentatorInfoType;

  @Prop({ type: postInfoSchema })
  postInfo: postInfoType;

  @Prop({ require: true })
  ownerUserId: string;

  @Prop()
  isBan: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
