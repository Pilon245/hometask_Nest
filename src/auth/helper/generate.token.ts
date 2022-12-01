import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserOutputModel } from '../../users/dto/entity.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGenerate {
  constructor(private configService: ConfigService) {}
  private accessTokenJwtSecret =
    this.configService.get<string>('ACCESS_JWT_SECRET');
  private refreshTokenJwtSecret =
    this.configService.get<string>('REFRESH_JWT_SECRET');
  async generateTokens(user: UserOutputModel, deviceId: string) {
    const accessToken = jwt.sign({ id: user.id }, this.accessTokenJwtSecret, {
      expiresIn: '7m',
    });
    const refreshToken = jwt.sign(
      { id: user.id, deviceId: deviceId },
      this.refreshTokenJwtSecret,
      { expiresIn: '7m' },
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
