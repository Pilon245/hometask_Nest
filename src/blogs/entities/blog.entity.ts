import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ require: true })
  id: string;

  @Prop({ require: true })
  name: string;

  @Prop({ require: true })
  description: string;

  @Prop({ require: true })
  websiteUrl: string;

  @Prop({ require: true })
  createdAt: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
