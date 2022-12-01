import * as bcrypt from 'bcrypt';
import { SETTING } from '../service/SETTING';
import * as jwt from 'jsonwebtoken';

export const _generatePasswordForDb = async (password: string) => {
  return bcrypt.hash(password, 6);
};

export const payloadRefreshToken = async (token: string) => {
  const refToken = token.split(' ')[0];
  try {
    const result: any = jwt.verify(token, SETTING.JWT_SECRET);
    return result;
  } catch (error) {
    return null;
  }
};
