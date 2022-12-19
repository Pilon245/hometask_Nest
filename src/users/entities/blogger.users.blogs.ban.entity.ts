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
  @Prop()
  id: string;

  @Prop()
  blogId: string;

  @Prop()
  bloggerId: string;

  @Prop()
  login: string;

  @Prop({ type: BloggerUsersBanInfoTypeDataSchema })
  banInfo: BloggerUsersBanInfoTypeData;
}

export const BloggerUsersBanSchema =
  SchemaFactory.createForClass(BloggerUsersBan);
