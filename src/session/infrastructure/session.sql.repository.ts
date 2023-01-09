import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/entities/session.entity';
import { Injectable, Scope } from '@nestjs/common';
import { CreateSessionInputModel } from '../domain/dto/create-session.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class SessionSqlRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findDevices(userId: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Sessions"  WHERE "userId" = '${userId}'`,
    );
    if (!result) return false;
    return result.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: d.lastActiveDate,
      deviceId: d.deviceId,
    }));
  }
  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Sessions"  WHERE "deviceId" = '${deviceId}' AND 
        "userId" = '${userId}'`,
    );
    if (!result) return false;
    return {
      id: result[0].id,
      ip: result[0].ip,
      title: result[0].title,
      lastActiveDate: result[0].lastActiveDate,
      expiresDate: result[0].expiresDate,
      deviceId: result[0].deviceId,
      userId: result[0].userId,
    };
  }
  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Sessions"  WHERE "deviceId" = '${deviceId}'`,
    );
    if (!result) return false;
    return {
      id: result[0].id,
      ip: result[0].ip,
      title: result[0].title,
      lastActiveDate: result[0].lastActiveDate,
      expiresDate: result[0].expiresDate,
      deviceId: result[0].deviceId,
      userId: result[0].userId,
    };
  }
  async createSecurityDevices(device: CreateSessionInputModel) {
    await this.dataSource.query(`INSERT INTO public."Sessions"(
"ip", "title", "lastActiveDate", "expiresDate", "deviceId", "userId")
    VALUES('${device.ip}', '${device.title}', '${device.lastActiveDate}',
     '${device.expiresDate}','${device.deviceId}', '${device.userId}');`);

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
