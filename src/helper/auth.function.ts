import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
export class AuthFunction {
  constructor(private configService: ConfigService) {} //todo  тут через класс, ? асинк нужен?
  // export const _generatePasswordForDb = async (password: string) => {
  //   const salt = await bcrypt.genSalt(6);
  //   const hash = await bcrypt.hash(password, salt);
  //   return hash;
  // }
}
//todo как лучше делажить и как дебажить через debbug
