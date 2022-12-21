// export const checkCredentials = async (
//   loginOrEmail: string,
//   password: string,
// ) => {
//   const user = await usersRepository.findLoginOrEmail(loginOrEmail);
//   if (!user) {
//     return false;
//   }
//   const passwordHash = await _generatePasswordForDb(password);
//   const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
//   if (!isValid) {
//     return false;
//   }
//   return user;
// };

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/application/users.service';
import { Observable } from 'rxjs';
import { _generatePasswordForDb } from './auth.function';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/infrastructure/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected usersService: UsersService,
    protected userRepository: UsersRepository,
  ) {}
  async canActivate(
    context: ExecutionContext,
    // @Body() inputModel: { password: string },
  ) {
    const request: Request = context.switchToHttp().getRequest();
    const body = request.body as unknown as { password: string };
    // @ts-ignore
    const loginOrEmail = request.body.loginOrEmail;
    const password = body.password;
    console.log('loginOrEmail', loginOrEmail);
    console.log('password', password);
    const user = await this.userRepository.findLoginOrEmail(loginOrEmail);
    if (!user) {
      return false;
    }
    const passwordHash = await _generatePasswordForDb(password);
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    console.log(isValid, 'isValid');
    if (!isValid) {
      return false;
    }
    console.log(isValid, 'isValid');
  }
}

//   loginOrEmail: string,
//   password: string,
// ) => {
//   const user = await usersRepository.findLoginOrEmail(loginOrEmail);
//   if (!user) {
//     return false;
//   }
//   const passwordHash = await _generatePasswordForDb(password);
//   const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
//   if (!isValid) {
//     return false;
//   }
//   return user;
// };
