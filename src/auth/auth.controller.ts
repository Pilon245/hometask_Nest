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
  HttpCode,
  BadRequestException,
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
import { CreateUserInputModel, UsersFactory } from '../users/dto/usersFactory';
import { EmailManager } from '../managers/email.manager';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { UsersRepository } from '../users/users.repository';
import { SessionRepository } from '../session/session.repository';
import { SessionQueryRepository } from '../session/session.query.repository';
import {
  ConfirmationInputModel,
  NewPasswordInputModel,
  RegistrationEmailInputModel,
} from './dto/registration.dto';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './strategy/custom.throttler.guard';
import { JwtGenerate } from './helper/generate.token';
import { User } from '../users/users.entity';
import { RefreshTokenGuard } from './strategy/refresh.token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersService: UsersService,
    protected jwtService: JwtService,
    protected jwtGenerate: JwtGenerate,
    protected usersRepository: UsersRepository,
    protected sessionService: SessionService,
    protected sessionQueryRepository: SessionQueryRepository,
    protected usersQueryRepository: UsersQueryRepository, // protected sessionService: SessionService,
    protected emailManager: EmailManager,
  ) {}
  // @UseGuards(CustomThrottlerGuard)
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
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: session.accessToken });
  }
  // @UseGuards(CustomThrottlerGuard)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async updateResfreshToken(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(
      req.user,
      req.cookies.refreshToken,
    );
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 6000000),
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: tokens.accessToken });
  }
  // @Throttle() //todo это откдючить гвард?
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myAccount(@Req() req, @Res() res: Response) {
    const Account = await this.usersQueryRepository.findUsersByIdOnMyAccount(
      req.user.id,
    );
    return res.status(200).send(Account);
  }
  // @UseGuards(CustomThrottlerGuard)
  @Post('registration')
  @HttpCode(204)
  async createRegistrationUser(
    @Req() req,
    @Body() inputModel: CreateUserInputModel,
    @Res() res: Response,
  ) {
    const newUsers = await this.authService.registrationUsers(inputModel);
    const findUserByEmail = await this.usersQueryRepository.findLoginOrEmail(
      inputModel.email,
    );
    if (findUserByEmail) {
      throw new BadRequestException([
        {
          message: 'Email already exists',
          field: 'Email',
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
          field: 'Login',
        },
      ]);
    }
    return res.sendStatus(204);
  }
  // @UseGuards(CustomThrottlerGuard)
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
  // @UseGuards(CustomThrottlerGuard)
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
    const emailSend = await this.emailManager.sendPasswordRecoveryMessage(user);
    return res.sendStatus(204);
  }
  // @UseGuards(CustomThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(204)
  async recoveryPassword(
    @Req() req,
    @Body() inputModel: RegistrationEmailInputModel,
    @Res() res: Response,
  ) {
    const updateCode = await this.authService.updatePasswordCode(
      req.body.email,
    );
    const user = await this.usersRepository.findLoginOrEmail(req.body.email);
    if (!user) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    if (user) {
      // const update = this.usersRepository.updatePasswordUsers(//todo спросить у вани на счет этого
      //   user.id,
      //   'password', //todo тут можно отправить поле null,
      // );
      const passwordEmail = this.emailManager.sendNewPasswordMessage(user);
    }
    return res.sendStatus(204);
  }
  // @UseGuards(CustomThrottlerGuard)
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
  // @UseGuards(CustomThrottlerGuard)
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logOutAccount(@Req() req, @Res() res: Response) {
    console.log('req.user', req.user);
    await this.sessionService.deleteDevicesById(req.user.deviceId);
    return res.sendStatus(204);
  }
}
