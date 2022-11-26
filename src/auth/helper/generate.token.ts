import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserOutputModel } from '../../users/dto/entity.dto';
import { SETTING } from '../../service/SETTING'; //todo  тут сделать через env?

@Injectable() //todo тут нужно экжентить?
export class JwtGenerate {
  async generateTokens(user: UserOutputModel, deviceId: string) {
    const accessToken = jwt.sign({ id: user.id }, SETTING.JWT_SECRET, {
      expiresIn: '7m',
    });
    const refreshToken = jwt.sign(
      { id: user.id, deviceId: deviceId },
      SETTING.JWT_SECRET,
      { expiresIn: '7m' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async verifyTokens(token: string) {
    try {
      const result: any = jwt.verify(token, SETTING.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }
}
