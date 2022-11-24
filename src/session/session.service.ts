import { Injectable } from '@nestjs/common';
import { SessionFactory } from './dto/create-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from './entities/session.entity';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';
import { SessionRepository } from './session.repository';
import { UserAccountDBType } from '../users/dto/entity.dto';

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: SessionRepository) {}
  async findDevices(id: string) {
    const devices = await this.sessionRepository.findDevices(id);
    return devices;
  }
  async findDevicesByDeviceId(deviceId: string) {
    const devices = await this.sessionRepository.findDevices(deviceId);
    return devices;
  }
  async createSession(
    user: UserAccountDBType,
    ip: string,
    deviceName: string,
    payload: any,
    device: string,
  ) {
    const userId = user.id;
    const deviceId = device;

    // const payload = await jwtService.getUserIdByRefreshToken(
    //   token.split(' ')[0],
    // );
    const session = new SessionFactory(
      ip,
      deviceName,
      new Date(payload.iat * 1000).toISOString(),
      new Date(payload.iat * 1000).toDateString(),
      deviceId,
      userId,
    );
    await this.sessionRepository.createSecurityDevices(session);
  }
  async updateSession(user: UserAccountDBType, token: string, payload: any) {
    const userId = user.id;
    // const payload = await jwtService.getUserIdByRefreshToken(
    //   token.split(' ')[0],
    // );
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.sessionRepository.updateSecurityDevices(
      userId,
      payload.deviceId,
      lastActiveDate,
    );
  }
  async deleteDevices(id: string, deviceId: string) {
    return await this.sessionRepository.deleteDevices(id, deviceId);
  }
  async deleteDevicesById(deviceId: string) {
    return await this.sessionRepository.deleteDeviceById(deviceId);
  }
  async deleteAllSessions() {
    return await this.sessionRepository.deleteAllSessions();
  }
}
