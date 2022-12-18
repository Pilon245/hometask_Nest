import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BanBlogsInfoType, BlogOwnerInfoType } from '../dto/blogs.entity.dto';
import { BanInfoType } from '../../users/dto/entity.dto';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ id: false })
export class BlogOwnerInfo {
  @Prop({ require: true })
  userId: string;
  @Prop({ require: true })
  userLogin: string;
}
const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfo);

@Schema({ id: false })
export class BanBlogsInfoTypeData {
  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: string;
}

const BanBlogsInfoTypeDataSchema =
  SchemaFactory.createForClass(BanBlogsInfoTypeData);

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

  @Prop({ type: BanBlogsInfoTypeDataSchema })
  banInfo: BanBlogsInfoType;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
