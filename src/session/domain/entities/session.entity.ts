import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ require: true })
  id: string;
  @Prop({ require: true })
  ip: string;
  @Prop({ require: true })
  title: string;
  @Prop({ require: true })
  lastActiveDate: string;
  @Prop({ require: true })
  expiresDate: string;
  @Prop({ require: true })
  deviceId: string;
  @Prop({ require: true })
  userId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
