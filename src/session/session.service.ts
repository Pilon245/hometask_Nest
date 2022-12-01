import { Injectable } from '@nestjs/common';
import { SessionFactory } from './dto/create-session.dto';

import { SessionRepository } from './session.repository';
import { UserAccountDBType, UserOutputModel } from '../users/dto/entity.dto';
import { randomUUID } from 'crypto';
import { JwtGenerate } from '../auth/helper/generate.token';

@Injectable()
export class SessionService {
  constructor(
    protected sessionRepository: SessionRepository,
    protected jwtGenerate: JwtGenerate,
  ) {}
  async findDevices(id: string) {
    return this.sessionRepository.findDevices(id);
  }
  async findDevicesByDeviceId(deviceId: string) {
    return this.sessionRepository.findDevices(deviceId);
  }
  async createSession(user: UserOutputModel, ip: string, deviceName: string) {
    const userId = user.id;
    const deviceId = String(randomUUID());
    const tokens = await this.jwtGenerate.generateTokens(user, deviceId);
    const payload = await this.jwtGenerate.verifyTokens(
      tokens.refreshToken.split(' ')[0],
    );
    const session = new SessionFactory(
      ip,
      deviceName,
      new Date(payload.iat * 1000).toISOString(),
      new Date(payload.iat * 1000).toDateString(),
      deviceId,
      userId,
    );
    await this.sessionRepository.createSecurityDevices(session);
    return tokens;
  }
  async updateSession(user: UserAccountDBType, payload: any) {
    const userId = user.id;
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
