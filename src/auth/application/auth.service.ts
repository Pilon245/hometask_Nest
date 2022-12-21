import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../../session/application/session.service';
import { CreateSessionUseCaseDto } from '../../session/domain/dto/create-session.dto';
import { CreateSessionCommand } from '../../session/application/use-cases/create.session.use.cases';
import { CommandBus } from '@nestjs/cqrs';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    private sessionService: SessionService,
    private commandBus: CommandBus,
  ) {}

  async validateUser(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepository.findLoginOrEmail(LoginOrEmail);
    if (!user || user.banInfo.isBanned) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }
  async login(req: any) {
    const newSession: CreateSessionUseCaseDto = {
      userId: req.user.id,
      ip: req.ip,
      deviceName: req.headers['user-agent'],
    };
    return this.commandBus.execute(new CreateSessionCommand(newSession));
  }
  // async registrationUsers(inputModel: CreateUserInputModel) {
  //   const passwordHash = await _generatePasswordForDb(inputModel.password);
  //   const newUser = new UsersFactory(
  //     String(+new Date()),
  //     {
  //       login: inputModel.login,
  //       email: inputModel.email,
  //       passwordHash: passwordHash,
  //       createdAt: new Date().toISOString(),
  //     },
  //     {
  //       confirmationCode: randomUUID(),
  //       expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
  //       isConfirmed: false,
  //     },
  //     {
  //       confirmationCode: randomUUID(),
  //       expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
  //       isConfirmed: false,
  //     },
  //     {
  //       isBanned: false,
  //       banDate: new Date().toISOString(),
  //       banReason: 'string',
  //     },
  //   );
  //   await this.emailManager.sendPasswordRecoveryMessage(newUser);
  //   await this.usersRepository.createUsers(newUser);
  //   return newUser;
  // }
  // async refreshTokens(currentPayload: any) {
  //   const tokens = await this.jwtGenerate.generateTokens(
  //     currentPayload.id,
  //     currentPayload.deviceId,
  //   );
  //   const payload = await this.jwtGenerate.verifyTokens(tokens.refreshToken);
  //
  //   await this.sessionService.updateSession(currentPayload.id, payload);
  //   return {
  //     refreshToken: tokens.refreshToken,
  //     accessToken: tokens.accessToken,
  //   };
  // }
  // async confirmationEmail(code: string) {
  //   const user = await this.usersRepository.findUserByConfirmationEmailCode(
  //     code,
  //   );
  //   if (!user) return false;
  //   return this.usersRepository.updateEmailConfirmation(user.id);
  // }
  // async updateEmailCode(email: string) {
  //   const user = await this.usersRepository.findLoginOrEmail(email);
  //   if (!user || user.emailConfirmation.isConfirmed) return false;
  //   const newCode = randomUUID();
  //   return this.usersRepository.updateEmailCode(user.id, newCode);
  // }
  // async updatePasswordCode(email: string) {
  //   const user = await this.usersRepository.findLoginOrEmail(email);
  //   if (!user) {
  //     return false;
  //   }
  //   const newCode = randomUUID();
  //   if (user) {
  //     return this.usersRepository.updatePasswordCode(user.id, newCode);
  //   }
  //   return true;
  // }
  // async updatePasswordUsers(code: string, password: string) {
  //   const user = await this.usersRepository.findUserByConfirmationPasswordCode(
  //     code,
  //   );
  //   if (!user) return false;
  //   const passwordHash = await _generatePasswordForDb(password);
  //   await this.usersRepository.updatePasswordConfirmation(user.id);
  //   return this.usersRepository.updatePasswordUsers(user.id, passwordHash);
  // }
}
//todo как нужно сервис к чужому репозиторию или к другому сервису
