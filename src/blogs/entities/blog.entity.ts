import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UsersAccountData } from '../../users/entities/users.entity';
import { BlogOwnerInfoType } from '../dto/blogs.entity.dto';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ id: false })
export class BlogOwnerInfo {
  @Prop({ require: true })
  userId: string;
  @Prop({ require: true })
  userLogin: string;
}
const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfo);

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

  @Prop({ type: BlogOwnerInfoSchema })
  blogOwnerInfo: BlogOwnerInfoType;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
