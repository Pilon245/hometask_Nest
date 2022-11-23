import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { randomUUID } from 'crypto';
import { _generatePasswordForDb } from '../helper/auth.function';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { setting } from '../service/setting';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepository.findLoginOrEmail(LoginOrEmail);
    console.log('user', user);
    if (!user) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
    // return null;
  }
  async login(user: any) {
    console.log('user', user);
    if (!user) {
      return false;
    }
    if (user) {
      const deviceId = String(randomUUID());
      const accessToken = await jwt.sign({ id: user.id }, setting.JWT_SECRET, {
        expiresIn: '7m',
      });
      const refreshToken = await jwt.sign(
        { id: user.id, deviceId: deviceId },
        setting.JWT_SECRET,
        { expiresIn: '7m' },
      );
      const result = { accessToken: accessToken };
      return { refreshToken: refreshToken, accessToken: accessToken };
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
        user!.id,
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
