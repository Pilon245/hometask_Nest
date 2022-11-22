import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
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
