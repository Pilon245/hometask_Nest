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
  Ip,
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
import { Response, Request } from 'express';
import { payloadRefreshToken } from '../helper/auth.function';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CreateUserInputModel } from '../users/dto/usersFactory';
import { EmailManager } from '../managers/email.manager';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { UsersRepository } from '../users/users.repository';
import { SessionRepository } from '../session/session.repository';
import { SessionQueryRepository } from '../session/session.query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersService: UsersService,
    protected jwtService: JwtService,
    protected usersRepository: UsersRepository,
    protected sessionService: SessionService,
    protected sessionQueryRepository: SessionQueryRepository,
    protected usersQueryRepository: UsersQueryRepository, // protected sessionService: SessionService,
    protected emailManager: EmailManager,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async singInAccount(
    @Req() req,
    @Body() inputModel: LoginInputModel,
    @Res() res: Response,
    @Ip() ip,
  ) {
    // const LoginDto = {
    //   user: req.user,
    //   ip: ip,
    //   agent: req.headers['user-agent'],
    // };
    // const tokens = await this.authService.login(req);
    const session = await this.sessionService.createSession(
      req.user,
      req.ip,
      req.headers['user-agent'],
    );
    return res
      .cookie('refreshToken', session.refreshToken, {
        expires: new Date(Date.now() + 6000000),
        httpOnly: false,
        secure: false,
      })
      .send({ accessToken: session.accessToken });
  }

  @Post('refresh-token')
  async updateResfreshToken(@Req() req, @Res() res: Response) {
    console.log('req.cookies.refreshToken', req.cookies.refreshToken);
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = await payloadRefreshToken(req.cookies.refreshToken);
    console.log('result', result);
    const user = await this.usersQueryRepository.findUsersById(result.id);
    const foundLastDate =
      await this.sessionQueryRepository.findDevicesByDeviceId(result.deviceId);
    if (
      !foundLastDate ||
      foundLastDate.lastActiveDate !== new Date(result.iat * 1000).toISOString()
    ) {
      return res.sendStatus(401);
    }
    if (user) {
      const tokens = await this.authService.refreshToken(
        user,
        req.cookies.refreshToken,
      );
      if (!tokens) {
        return res.sendStatus(401);
      }
      return res
        .status(200)
        .cookie('refreshToken', tokens.refreshToken, {
          expires: new Date(Date.now() + 6000000),
          httpOnly: true,
          secure: true,
        })
        .send({ accessToken: tokens.accessToken });
    } else {
      return res.sendStatus(401); //todo сделать через Exzeption  которые встроенны в нест
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myAccount(@Req() req, @Res() res: Response) {
    const Account = await this.usersQueryRepository.findUsersById(req.user.id);
    return res.status(200).send(Account);
  }

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
  @Post('logout')
  async logOutAccount(@Req() req, @Res() res: Response) {
    if (!req.cookies.refreshToken) return res.sendStatus(401);
    const result: any = await payloadRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    const foundLastDate =
      await this.sessionQueryRepository.findDevicesByDeviceId(result.deviceId);
    if (
      !foundLastDate ||
      foundLastDate.lastActiveDate !== new Date(result.iat * 1000).toISOString()
    ) {
      return res.sendStatus(401);
    }
    await this.sessionService.deleteDevicesById(result.deviceId);
    // await this.usersRepository.deleteToken(
    //   req.user.id,
    //   req.cookies.refreshToken,
    //   payload.deviceId,
    // );
    return res.sendStatus(204);
  }
}
