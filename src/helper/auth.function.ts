import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { setting } from '../service/setting';
import * as jwt from 'jsonwebtoken';

// export class AuthFunction {
//   constructor(private configService: ConfigService,
//               public password: Password) {}
//     const salt = await bcrypt.genSalt(6);
//     const hash = await bcrypt.hash(password, salt);
//     return hash;
// }
export const _generatePasswordForDb = async (password: string) => {
  console.log('stok');

  // const salt = await bcrypt.genSalt(6);
  // console.log(salt, 'salt');

  const hash = await bcrypt.hash(password, 6);
  return hash;
};

export const payloadRefreshToken = async (token: string) => {
  const refToken = token.split(' ')[0];
  try {
    const result: any = jwt.verify(token, setting.JWT_SECRET);
    return result;
  } catch (error) {
    return null;
  }
};
