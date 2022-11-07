import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;

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
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
