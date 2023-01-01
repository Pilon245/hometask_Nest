import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BloggerUsersBanDocument = HydratedDocument<BloggerUsersBan>;

@Schema({ id: false })
export class BloggerUsersBanInfoTypeData {
  //todo тут лучше  уже все в одной таблице длеать?
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
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  bloggerId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ type: BloggerUsersBanInfoTypeDataSchema })
  banInfo: BloggerUsersBanInfoTypeData;
}

export const BloggerUsersBanSchema =
  SchemaFactory.createForClass(BloggerUsersBan);
