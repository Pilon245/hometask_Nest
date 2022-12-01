import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { randomUUID } from 'crypto';
import { _generatePasswordForDb } from '../helper/auth.function';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../session/session.service';
import { JwtGenerate } from './helper/generate.token';
import { EmailManager } from '../managers/email.manager';
import { CreateUserInputModel, UsersFactory } from '../users/dto/usersFactory';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    private sessionService: SessionService,
    protected jwtGenerate: JwtGenerate,
    protected emailManager: EmailManager,
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
    return await this.sessionService.createSession(
      req.user,
      req.ip,
      req.headers['user-agent'],
    );
  }
  async registrationUsers(inputModel: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    const newUser = new UsersFactory(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        isBanned: false,
        banDate: new Date().toISOString(),
        banReason: 'string',
      },
    );
    await this.emailManager.sendPasswordRecoveryMessage(newUser);
    await this.usersRepository.createUsers(newUser);
    return newUser;
  }
  async refreshToken(user: any, token: string) {
    const payload = await this.jwtGenerate.verifyTokens(token);
    const tokens = await this.jwtGenerate.generateTokens(
      user,
      payload.deviceId,
    );
    await this.sessionService.updateSession(user, tokens.refreshToken);
    return {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    };
  }
  async confirmationEmail(code: string) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      code,
    );
    if (!user) return false;
    return this.usersRepository.updateEmailConfirmation(user.id);
  }
  async updateEmailCode(email: string) {
    const user = await this.usersRepository.findLoginOrEmail(email);
    if (!user || user.emailConfirmation.isConfirmed) return false;
    const newCode = randomUUID();
    return this.usersRepository.updateEmailCode(user.id, newCode);
  }
  async updatePasswordCode(email: string) {
    const user = await this.usersRepository.findLoginOrEmail(email);
    if (!user) {
      return false;
    }
    const newCode = randomUUID();
    if (user) {
      return this.usersRepository.updatePasswordCode(user.id, newCode);
    }
    return true;
  }
  async updatePasswordUsers(code: string, password: string) {
    const user = await this.usersRepository.findUserByConfirmationPasswordCode(
      code,
    );
    if (!user) return false;
    const passwordHash = await _generatePasswordForDb(password);
    await this.usersRepository.updatePasswordConfirmation(user.id);
    return this.usersRepository.updatePasswordUsers(user.id, passwordHash);
  }
}
