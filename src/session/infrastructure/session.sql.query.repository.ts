import {
  Session,
  SessionDocument,
} from '../domain/entities/nosql/session.entity';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class SessionSqlQueryRepository {
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

  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Sessions"  WHERE "deviceId" = '${deviceId}'`,
    );
    if (!result[0]) return false;
    return {
      ip: result[0].ip,
      title: result[0].title,
      lastActiveDate: result[0].lastActiveDate,
      expiresDate: result[0].expiresDate,
      deviceId: result[0].deviceId,
      userId: result[0].userId,
    };
  }

  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Sessions"  WHERE "deviceId" = '${deviceId}' AND 
        "userId" = '${userId}'`,
    );
    if (!result[0]) return false;
    return {
      ip: result[0].ip,
      title: result[0].title,
      lastActiveDate: result[0].lastActiveDate,
      expiresDate: result[0].expiresDate,
      deviceId: result[0].deviceId,
      userId: result[0].userId,
    };
  }
}
