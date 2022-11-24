import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { UserAccountDBType, UserOutputModel } from '../../users/dto/entity.dto';
import { setting } from '../../service/setting';

@Injectable() //todo тут нужно экжентить?
export class JwtGenerate {
  async generateTokens(user: UserOutputModel, deviceId: string) {
    const accessToken = jwt.sign({ id: user.id }, setting.JWT_SECRET, {
      expiresIn: '7m',
    });
    const refreshToken = jwt.sign(
      { id: user.id, deviceId: deviceId },
      setting.JWT_SECRET,
      { expiresIn: '7m' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
