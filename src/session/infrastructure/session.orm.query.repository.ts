import {
  Session,
  SessionDocument,
} from '../domain/entities/nosql/session.entity';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sessions } from 'src/session/domain/entities/sql/session.entity';

@Injectable({ scope: Scope.DEFAULT })
export class SessionOrmQueryRepository {
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
      .where('s."userId" = :userId', { userId })
      .getMany();
    // const result = await this.dataSource.query(
    //   `SELECT * FROM "Sessions"  WHERE "userId" = '${userId}'`,
    // );
    if (!result) return false;
    return result.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: d.lastActiveDate,
      deviceId: d.deviceId,
    }));
  }

  async findDevicesByDeviceId(deviceId: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select()
      .from('sessions', 's')
      .where('s."deviceId" = :deviceId', { deviceId })
      .getRawOne();

    if (!result) return false;
    return {
      ip: result.ip,
      title: result.title,
      lastActiveDate: result.lastActiveDate,
      expiresDate: result.expiresDate,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  }

  async findDevicesByDeviceIdAndUserId(userId: string, deviceId: string) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('s.*')
      .from('sessions', 's')
      .where('deviceId = :deviceId', { deviceId })
      .andWhere('userId = :userId', { userId })
      .getRawOne();

    if (!result) return false;
    return {
      ip: result.ip,
      title: result.title,
      lastActiveDate: result.lastActiveDate,
      expiresDate: result.expiresDate,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  }
}
