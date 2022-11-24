import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { randomUUID } from 'crypto';
import {
  _generatePasswordForDb,
  payloadRefreshToken,
} from '../helper/auth.function';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { setting } from '../service/setting';
import { generateTokens, verifyTokens } from './helper/generate.token';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    private sessionService: SessionService,
  ) {}

  async validateUser(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepository.findLoginOrEmail(LoginOrEmail);
    if (!user) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }
  async login(req: any) {
    if (!req.user) {
      return false;
    }
    if (req.user) {
      const deviceId = String(randomUUID());
      const tokens = await generateTokens(req.user, deviceId);
      // const payload = await jwtService.getUserIdByRefreshToken(
      //   req.split(' ')[0],
      // );
      const refreshToken = await verifyTokens(
        tokens.refreshToken.split(' ')[0],
      );
      await this.sessionService.createSession(
        req.user,
        req.ip,
        req.headers['user-agent']!,
        refreshToken,
        deviceId,
      );
      return {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
      };
    } else {
      return false;
    }
    // const deviceId = String(randomUUID());
    // const payload = { id: user.id, deviceId: deviceId };
    // console.log('user', deviceId);
    // return {
    //   access_token: await this.jwtService.sign(payload),
    // };
  }
  async refreshToken(user: any, token: string) {
    if (!user) {
      return false;
    }
    if (user) {
      const payload = await payloadRefreshToken(token);
      const tokens = await generateTokens(user, payload.deviceId); //todo тут как функцию или как класс?
      const refreshToken = await verifyTokens(
        tokens.refreshToken.split(' ')[0],
      );
      await this.sessionService.updateSession(user, refreshToken);
      return {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
      };
    } else {
      return false;
    }
    // const deviceId = String(randomUUID());
    // const payload = { id: user.id, deviceId: deviceId };
    // console.log('user', deviceId);
    // return {
    //   access_token: await this.jwtService.sign(payload),
    // };
  }
  async confirmationEmail(code: string) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      code,
    );
    const result = await this.usersRepository.updateEmailConfirmation(user!.id);
    return result;
  }
  async confirmationPassword(code: string) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      code,
    );
    const result = await this.usersRepository.updateEmailConfirmation(user!.id);
    return result;
  }
  async updateEmailCode(email: string) {
    const user = await this.usersRepository.findLoginOrEmail(email);
    const newCode = randomUUID();
    const result = await this.usersRepository.updateEmailCode(
      user!.id,
      newCode,
    );
    return result;
  }
  async updatePasswordCode(email: string) {
    const user = await this.usersRepository.findLoginOrEmail(email);
    const newCode = randomUUID();
    console.log('newCode', newCode);
    if (user) {
      const result = await this.usersRepository.updatePasswordCode(
        user.id,
        newCode,
      );
      return result;
    }
    return true;
  }
  async updatePasswordUsers(code: string, password: string) {
    const user = await this.usersRepository.findUserByConfirmationPasswordCode(
      code,
    );
    const passwordHash = await _generatePasswordForDb(password);
    await this.usersRepository.updatePasswordConfirmation(user!.id);
    const update = await this.usersRepository.updatePasswordUsers(
      user!.id,
      passwordHash,
    );
    return update;
  }
}
