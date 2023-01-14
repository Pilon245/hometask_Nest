import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGenerate {
  constructor(private configService: ConfigService) {}
  private accessTokenJwtSecret =
    this.configService.get<string>('ACCESS_JWT_SECRET');
  private refreshTokenJwtSecret =
    this.configService.get<string>('REFRESH_JWT_SECRET');
  async generateTokens(userId: string, deviceId: string) {
    const accessToken = jwt.sign({ id: userId }, this.accessTokenJwtSecret, {
      expiresIn: '10sec',
    });
    const refreshToken = jwt.sign(
      { id: userId, deviceId: deviceId },
      this.refreshTokenJwtSecret,
      { expiresIn: '20sec' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async verifyTokens(token: string) {
    try {
      const result: any = jwt.verify(token, this.accessTokenJwtSecret);
      return result;
    } catch (error) {
      return null;
    }
  }
}
