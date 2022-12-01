import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  Ip,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginInputModel } from './dto/create-auth.dto';
import { SessionService } from '../session/session.service';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { Response } from 'express';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CreateUserInputModel } from '../users/dto/usersFactory';
import { EmailManager } from '../managers/email.manager';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { UsersRepository } from '../users/users.repository';
import {
  ConfirmationInputModel,
  NewPasswordInputModel,
  RegistrationEmailInputModel,
} from './dto/registration.dto';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './strategy/custom.throttler.guard';
import { JwtGenerate } from './helper/generate.token';
import { RefreshTokenGuard } from './strategy/refresh.token.guard';

@UseGuards(CustomThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersService: UsersService,
    protected jwtGenerate: JwtGenerate,
    protected usersRepository: UsersRepository,
    protected sessionService: SessionService,
    protected usersQueryRepository: UsersQueryRepository,
    protected emailManager: EmailManager,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
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
    const tokens = await this.sessionService.createSession(
      req.user,
      ip,
      req.headers['user-agent'],
    );
    return res
      .cookie('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 20000),
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: tokens.accessToken });
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async updateRefreshToken(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(
      req.user,
      req.cookies.refreshToken,
    );
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 20000),
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: tokens.accessToken });
  }
  @Throttle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myAccount(@Req() req, @Res() res: Response) {
    const Account = await this.usersQueryRepository.findUsersByIdOnMyAccount(
      req.user.id,
    );
    return res.status(200).send(Account);
  }
  @Post('registration')
  @HttpCode(204)
  async createRegistrationUser(
    @Req() req,
    @Body() inputModel: CreateUserInputModel,
    @Res() res: Response,
  ) {
    const findUserByEmail = await this.usersQueryRepository.findLoginOrEmail(
      inputModel.email,
    );
    if (findUserByEmail) {
      throw new BadRequestException([
        {
          message: 'Email already exists',
          field: 'email',
        },
      ]);
    }
    const findUserByLogin = await this.usersQueryRepository.findLoginOrEmail(
      inputModel.login,
    );
    if (findUserByLogin) {
      throw new BadRequestException([
        {
          message: 'Login already exists',
          field: 'login',
        },
      ]);
    }
    await this.authService.registrationUsers(inputModel);
    return res.sendStatus(204);
  }
  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmationEmail(
    @Body() inputModel: ConfirmationInputModel,
    @Res() res: Response,
  ) {
    const result = await this.authService.confirmationEmail(inputModel.code);
    if (!result) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    return res.sendStatus(204);
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingEmail(
    @Req() req,
    @Body() inputModel: RegistrationEmailInputModel,
    @Res() res: Response,
  ) {
    const updateCode = await this.authService.updateEmailCode(inputModel.email);
    if (!updateCode) {
      throw new BadRequestException([
        { message: 'Incorrect email', field: 'email' },
      ]);
    }
    const user = await this.usersRepository.findLoginOrEmail(inputModel.email);
    await this.emailManager.sendPasswordRecoveryMessage(user);
    return res.sendStatus(204);
  }
  @Post('password-recovery')
  @HttpCode(204)
  async recoveryPassword(
    @Req() req,
    @Body() inputModel: RegistrationEmailInputModel,
    @Res() res: Response,
  ) {
    const user = await this.usersRepository.findLoginOrEmail(req.body.email);
    if (!user) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    await this.authService.updatePasswordCode(req.body.email);

    await this.emailManager.sendNewPasswordMessage(user);
    return res.sendStatus(204);
  }
  @Post('new-password')
  @HttpCode(204)
  async confirmationRecoveryPassword(
    @Req() req,
    @Body() inputModel: NewPasswordInputModel,
    @Res() res: Response,
  ) {
    const update = await this.authService.updatePasswordUsers(
      inputModel.recoveryCode,
      inputModel.newPassword,
    );
    if (!update) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    return res.sendStatus(204);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logOutAccount(@Req() req, @Res() res: Response) {
    await this.sessionService.deleteDevicesById(req.user.deviceId);
    return res.sendStatus(204);
  }
}
