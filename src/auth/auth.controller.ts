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
import { JwtService } from '../service/jwt.service';
import { LoginInputModel } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { SessionService } from '../session/session.service';
import { response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersService: UsersService,
    protected jwtService: JwtService,
    protected sessionService: SessionService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() req) {
    return req.user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async singInAccount(
    @Req() req,
    @Body() inputModel: LoginInputModel,
    @Res() res: Response,
  ) {
    const user = req.user;
    if (user) {
      const deviceId = String(randomUUID());
      const accessToken = await this.jwtService.createdJWT(user);
      const refreshToken = await this.jwtService.createdRefreshJWT(
        user,
        deviceId,
      );
      // await this.sessionService.createSession(
      //   user,
      //   req.ip,
      //   req.headers['user-agent']!,
      //   refreshToken,
      //   deviceId,
      // );
      const result = { accessToken: accessToken };
      return response
        .cookie('refreshToken', refreshToken, {
          expires: new Date(Date.now() + 6000000),
          httpOnly: true,
          secure: true,
        })
        .send(result);
    } else {
      return res.sendStatus(401);
    }
  }
  //
  // @Get(':id')
  // async updateResfreshToken(req: Request, res: Response) {
  //   const user = await usersService.checkRefreshToken(
  //     req.user!.accountData.login,
  //   );
  //   if (user) {
  //     const token = await payloadRefreshToken(req.cookies.refreshToken);
  //     const accessToken = await jwtService.createdJWT(user);
  //     const refreshToken = await jwtService.createdRefreshJWT(
  //       user,
  //       token.deviceId,
  //     );
  //     await sessionService.updateSession(user, refreshToken);
  //     // await usersRepository.updateToken(user.id, refreshToken, token.deviceId)
  //     const result = { accessToken: accessToken };
  //     return res
  //       .status(200)
  //       .cookie('refreshToken', refreshToken, {
  //         expires: new Date(Date.now() + 6000000),
  //         httpOnly: true,
  //         secure: true,
  //       })
  //       .send(result);
  //   } else {
  //     return res.sendStatus(401);
  //   }
  // }

  // @Patch(':id')
  // async myAccount(req: Request, res: Response) {
  //   const Account = await usersService.findUserById(req.user!.id);
  //   return res.status(200).send(Account);
  // }
  //
  // async createRegistrationUser(req: Request, res: Response) {
  //   const newUsers = await usersService.createUsers(
  //     req.body.login,
  //     req.body.password,
  //     req.body.email,
  //   );
  //   const emailSend = await emailAdapter.sendEmail(
  //     newUsers.accountData.email,
  //     newUsers.emailConfirmation.confirmationCode,
  //   );
  //   return res.sendStatus(204);
  // }
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
