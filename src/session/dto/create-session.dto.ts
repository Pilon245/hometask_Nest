import { Prop } from '@nestjs/mongoose';

export class CreateSessionInputModel {
  id: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  expiresDate: string;
  deviceId: string;
  userId: string;
}
