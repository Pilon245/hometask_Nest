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
  async findDevices(userId: string) {
    const result = await this.sessionModel
      .find({
        userId: userId,
      })
      .lean();
    return result.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: d.lastActiveDate,
      deviceId: d.deviceId,
    }));
  }
  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.sessionModel
      .findOne({
        deviceId: deviceId,
      })
      .lean();
    return result;
  }
  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    const result = await this.sessionModel
      .findOne({
        $and: [{ userId: userId }, { deviceId: deviceId }],
      })
      .lean();
    return result;
  }
}
