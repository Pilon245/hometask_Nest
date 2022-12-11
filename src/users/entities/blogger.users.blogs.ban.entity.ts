import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from '../dto/entity.dto';
import { json } from 'express';
import { UsersBanInfoTypeData } from './users.entity';

export type BloggerUsersBanDocument = HydratedDocument<BloggerUsersBan>;

@Schema({ id: false })
export class BloggerUsersBanInfoTypeData {
  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: string;

  @Prop()
  banReason: string;
}

const BloggerUsersBanInfoTypeDataSchema = SchemaFactory.createForClass(
  BloggerUsersBanInfoTypeData,
);

@Schema()
export class BloggerUsersBan {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  bloggerId: string;

  @Prop({ required: true })
  banUserId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ type: BloggerUsersBanInfoTypeDataSchema })
  banInfo: BloggerUsersBanInfoTypeData;
}

export const BloggerUsersBanSchema =
  SchemaFactory.createForClass(BloggerUsersBan);
