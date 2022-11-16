import { Injectable } from '@nestjs/common';
import { UserAccountDBType } from '../users/dto/entity.dto';
import jwt from 'jsonwebtoken';
import { setting } from './setting';

@Injectable()
export class JwtService {
  async createdJWT(user: UserAccountDBType) {
    const token = jwt.sign({ id: user.id }, setting.JWT_SECRET, {
      expiresIn: '7m',
    });
    return token;
  }
  async createdRefreshJWT(user: UserAccountDBType, deviceId: string) {
    const refreshToken = jwt.sign(
      { id: user.id, deviceId: deviceId },
      setting.JWT_SECRET,
      { expiresIn: '7m' },
    );
    return refreshToken;
  }
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, setting.JWT_SECRET);
      return result.id;
    } catch (error) {
      return null;
    }
  }
  async getUserIdByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, setting.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }
}
