import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AvatarDocument = HydratedDocument<Avatars>;

@Schema()
export class Avatars {
  @Prop()
  name: string;
  @Prop()
  image: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatars);
