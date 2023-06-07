import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Session,
  SessionDocument,
} from '../domain/entities/nosql/session.entity';
import { Injectable, Scope } from '@nestjs/common';
import { CreateSessionInputModel } from '../domain/dto/create-session.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from 'src/users/domain/entities/sql/user.entity';
import { Sessions } from 'src/session/domain/entities/sql/session.entity';

@Injectable({ scope: Scope.DEFAULT })
export class SessionOrmRepository {
  constructor(
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findDevices(userId: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('s.*')
      .from('sessions', 's')
      .where('userId = :userId', { userId })
      .getRawOne();
    if (!result) return false;
    return result.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: d.lastActiveDate,
      deviceId: d.deviceId,
    }));
  }

  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('s.*')
      .from('sessions', 's')
      .where('userId = :userId', { userId })
      .andWhere('deviceId = :deviceId', { deviceId })
      .getRawOne();

    if (!result) return false;
    return {
      id: result.id,
      ip: result.ip,
      title: result.title,
      lastActiveDate: result.lastActiveDate,
      expiresDate: result.expiresDate,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  }

  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('s.*')
      .from('sessions', 's')
      .where('deviceId = :deviceId', { deviceId })
      .getRawOne();

    if (!result) return false;
    return {
      id: result.id,
      ip: result.ip,
      title: result.title,
      lastActiveDate: result.lastActiveDate,
      expiresDate: result.expiresDate,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  }

  async createSecurityDevices(device: CreateSessionInputModel) {
    const newSession = new Sessions();
    newSession.ip = device.ip;
    newSession.title = device.title;
    newSession.lastActiveDate = device.lastActiveDate;
    newSession.expiresDate = device.expiresDate;
    newSession.deviceId = device.deviceId;
    newSession.userId = device.userId;
    await this.sessionsRepository.save(newSession);
    //     await this.dataSource.query(`INSERT INTO "Sessions"(
    // "ip", "title", "lastActiveDate", "expiresDate", "deviceId", "userId")
    //     VALUES('${device.ip}', '${device.title}', '${device.lastActiveDate}',
    //      '${device.expiresDate}','${device.deviceId}', '${device.userId}');`);

    return device;
  }

  async updateSecurityDevices(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    const session = await this.sessionsRepository.findOneBy({
      deviceId: deviceId,
      userId: userId,
    });
    session.lastActiveDate = lastActiveDate;
    return this.sessionsRepository.save(session);

    return true;
  }

  async deleteDevices(userId: string, deviceId: string) {
    await this.dataSource.query(`DELETE FROM "sessions"
	WHERE NOT("deviceId" = '${deviceId}') AND "userId" = '${userId}';`);

    return true;
  }

  async deleteUserDevices(userId: string) {
    await this.dataSource.query(`DELETE FROM "sessions"
	WHERE "userId" = '${userId}';`);

    return true;
  }

  async deleteDeviceById(deviceId: string) {
    await this.dataSource.query(`DELETE FROM "sessions"
	WHERE "deviceId" = '${deviceId}';`);

    return true;
  }

  async deleteAllSessions() {
    this.dataSource.query(`DELETE FROM "sessions"
	WHERE ${1} = '${1}';`);

    return true;
  }
}
