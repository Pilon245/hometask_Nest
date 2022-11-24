import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginInputModel } from './dto/create-auth.dto';
// import { AuthGuard } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { SessionService } from '../session/session.service';
import { response } from 'express';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { Response } from 'express';
import { LocalStrategy } from './strategy/local.strategy';
import { setting } from '../service/setting';
import * as jwt from 'jsonwebtoken';
import { payloadRefreshToken } from '../helper/auth.function';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { UsersQueryRepository } from '../users/users.query.repository';
import { RegistrationInputModel } from './dto/registration.dto';
import { CreateUserInputModel } from '../users/dto/usersFactory';
import { EmailManager } from '../managers/email.manager';
import { generateTokens } from './helper/generate.token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersService: UsersService,
    protected jwtService: JwtService, // protected sessionService: SessionService,
    protected usersQueryRepository: UsersQueryRepository, // protected sessionService: SessionService,
    protected emailManager: EmailManager,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async singInAccount(
    @Req() req,
    @Body() inputModel: LoginInputModel,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.login(req);
    if (!tokens) return res.sendStatus(401);
    return res
      .cookie('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 6000000),
        httpOnly: false,
        secure: false,
      })
      .send({ accessToken: tokens.accessToken });
  }

  @Post('refresh-token')
  async updateResfreshToken(@Req() req, @Res() res: Response) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = jwt.verify(
      req.cookies.refreshToken,
      setting.JWT_SECRET,
    );
    const user = await this.usersQueryRepository.findUsersById(result.id);
    if (user) {
      const token = await payloadRefreshToken(req.cookies.refreshToken);
      const tokens = await generateTokens(user, token.deviceId); //todo тут как функцию или как класс?
      // await sessionService.updateSession(user, refreshToken);
      // await usersRepository.updateToken(user.id, refreshToken, token.deviceId)
      const result = { accessToken: tokens.accessToken };
      return res
        .status(200)
        .cookie('refreshToken', tokens.refreshToken, {
          expires: new Date(Date.now() + 6000000),
          httpOnly: true,
          secure: true,
        })
        .send(result);
    } else {
      return res.sendStatus(401); //todo сделать через Exzeption  которые встроенны в нест
    }
  }

  // @Patch(':id')
  // async myAccount(req: Request, res: Response) {
  //   const Account = await usersService.findUserById(req.user!.id);
  //   return res.status(200).send(Account);
  // }
  //
  @Post('registration')
  async createRegistrationUser(
    @Req() req,
    @Body() inputModel: CreateUserInputModel,
    @Res() res: Response,
  ) {
    const newUsers = await this.usersService.createUsers(inputModel);
    if (!newUsers) return res.sendStatus(404);
    const emailSend = await this.emailManager.sendPasswordRecoveryMessage(
      newUsers,
    );
    return res.sendStatus(204);
  }
  // async confirmationEmail(req: Request, res: Response) {
  //   const result = await authService.confirmationEmail(req.body.code);
  //   res.sendStatus(204);
  // }
  // async resendingEmail(req: Request, res: Response) {
  //   const updateCode = await authService.updateEmailCode(req.body.email);
  //   const user = await usersRepository.findLoginOrEmail(req.body.email);
  //   const emailSend = await emailAdapter.sendEmail(
  //     user!.accountData.email,
  //     user!.emailConfirmation.confirmationCode,
  //   );
  //   return res.sendStatus(204);
  // }

  // async recoveryPassword(req: Request, res: Response) {
  //   const updateCode = await authService.updatePasswordCode(req.body.email);
  //   const user = await usersRepository.findLoginOrEmail(req.body.email);
  //   if (user) {
  //     const update = usersRepository.updatePasswordUsers(user!.id, 'password');
  //     const passwordEmail = passwordEmailAdapter.sendPasswordOnEmail(
  //       user!.accountData.email,
  //       user!.passwordConfirmation.confirmationCode,
  //     );
  //   }
  //   return res.sendStatus(204);
  // }
  // async confirmationRecoveryPassword(req: Request, res: Response) {
  //   // const result = await authService.confirmationPassword(req.body.recoveryCode)
  //   const update = await authService.updatePasswordUsers(
  //     req.body.recoveryCode,
  //     req.body.newPassword,
  //   );
  //   res.sendStatus(204);
  // }
  // async logOutAccount(req: Request, res: Response) {
  //   const payload = await jwtService.getUserIdByRefreshToken(
  //     req.cookies.refreshToken.split(' ')[0],
  //   );
  //   await sessionService.deleteDevicesById(payload.deviceId);
  //   await usersRepository.deleteToken(
  //     req.user!.id,
  //     req.cookies.refreshToken,
  //     payload.deviceId,
  //   );
  //   return res.sendStatus(204);
  // }
}
