import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/entities/session.entity';
import { Injectable, Scope } from '@nestjs/common';
import { CreateSessionInputModel } from '../domain/dto/create-session.dto';

@Injectable({ scope: Scope.DEFAULT })
export class SessionRepository {
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
  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    return this.sessionModel
      .findOne({
        $and: [{ userId: userId }, { deviceId: deviceId }],
      })
      .lean();
  }
  async findDevicesByDeviceId(deviceId: string) {
    return this.sessionModel
      .findOne({
        deviceId: deviceId,
      })
      .lean();
  }
  async createSecurityDevices(device: CreateSessionInputModel) {
    const sessionInstance = await new this.sessionModel();

    sessionInstance.ip = device.ip;
    sessionInstance.title = device.title;
    sessionInstance.lastActiveDate = device.lastActiveDate;
    sessionInstance.expiresDate = device.expiresDate;
    sessionInstance.deviceId = device.deviceId;
    sessionInstance.userId = device.userId;

    await sessionInstance.save();

    return device;
  }
  async updateSecurityDevices(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    const sessionInstance = await this.sessionModel.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    if (!sessionInstance) return false;
    sessionInstance.lastActiveDate = lastActiveDate;

    await sessionInstance.save();

    return true;
    // return await SessionModelClass.updateOne({userId: userId, deviceId: deviceId},
    //                     {$set: {lastActiveDate: lastActiveDate}})
  }
  async deleteDevices(userId: string, deviceId: string) {
    // const sessionInstance = await SessionModelClass.find({userId: userId, deviceId: deviceId})
    // if (!sessionInstance) return false
    //
    // await sessionInstance.deleteMany({userId: userId, deviceId: deviceId})

    const result = await this.sessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return result.deletedCount === 1;
  }
  async deleteUserDevices(userId: string) {
    const result = await this.sessionModel.deleteMany({
      userId: userId,
    });
    return result.deletedCount === 1;
  }
  async deleteDeviceById(deviceId: string) {
    const sessionInstance = await this.sessionModel.findOne({
      deviceId: deviceId,
    });
    if (!sessionInstance) return false;

    await sessionInstance.deleteOne();

    return true;
    // const result = await SessionModelClass.deleteOne({deviceId: deviceId})
    // return result.deletedCount === 1
  }
  async deleteAllSessions() {
    await this.sessionModel.deleteMany({});
    return true;
  }
}
