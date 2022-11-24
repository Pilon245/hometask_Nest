import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserOutputModel } from '../../users/dto/entity.dto';
import { setting } from '../../service/setting';
//
// @Injectable() //todo тут нужно экжентить?
// export const JwtGenerate {
export const generateTokens = async (
  user: UserOutputModel,
  deviceId: string,
) => {
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
};

export const verifyTokens = async (token: string) => {
  try {
    const result: any = jwt.verify(token, setting.JWT_SECRET);
    return result;
  } catch (error) {
    return null;
  }
};
