import { Session, SessionDocument } from './entities/session.entity';
import { Injectable } from '@nestjs/common';
import { CreateSessionInputModel } from './dto/create-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.sessionModel
      .findOne({
        deviceId: deviceId,
      })
      .lean();
    return result;
  }
}
