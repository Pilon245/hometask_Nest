import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDocument = HydratedDocument<Post>;

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

  @Prop()
  isBan: boolean;

  @Prop({ require: true })
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
