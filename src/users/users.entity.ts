import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ require: true })
  id: string;

  @Prop({ require: true })
  login: string;

  @Prop({ require: true })
  email: string;

  @Prop({ require: true })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
