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
  Scope,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginInputModel } from '../domain/dto/create-auth.dto';
import { SessionService } from '../../session/application/session.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Response } from 'express';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { CreateUserInputModel } from '../../users/domain/dto/usersFactory';
import { EmailManager } from '../../managers/email.manager';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import {
  ConfirmationInputModel,
  NewPasswordInputModel,
  RecoveryPasswordUserUseCaseDto,
  RegistrationEmailInputModel,
} from '../domain/dto/registration.dto';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../guards/custom.throttler.guard';
import { RefreshTokenGuard } from '../guards/refresh.token.guard';
import { CurrentUserId } from '../current-user.param.decorator';
import { BasicStrategy } from '../strategy/basic-strategy.service';
import { BasicAdminGuard } from '../guards/basic-admin.guard';
import { CurrentPayload } from '../current-payload.param.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDeviceByDeviceIdCommand } from '../../session/application/use-cases/delete.device.id.session.use.cases';
import { UpdateSessionCommand } from '../../session/application/use-cases/update.session.use.cases';
import { CreateSessionCommand } from '../../session/application/use-cases/create.session.use.cases';
import { CreateSessionUseCaseDto } from '../../session/domain/dto/create-session.dto';
import { RegistrationUsersCommand } from '../application/use-cases/registration.users.use.cases';
import { ConfirmationEmailCommand } from '../application/use-cases/confirmation.email.use.cases';
import { UpdateEmailCodeCommand } from '../application/use-cases/update.email.code.use.cases';
import {
  UpdatePasswordCodeCommand,
  UpdatePasswordCodeUseCase,
} from '../application/use-cases/update.password.code.use.cases';
import { RecoveryPasswordUserCommand } from '../application/use-cases/recovery.password.user.use.cases';
import { UsersSqlRepository } from '../../users/infrastructure/users.sql.repository';
import { UsersSqlQueryRepository } from '../../users/infrastructure/users.sql.query.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';
import { UsersOrmQueryRepository } from 'src/users/infrastructure/users.orm.query.repository';

// @UseGuards(CustomThrottlerGuard) //todo проверить как сильно нагружает гвард
@ApiTags('Auth')
@Controller({
  path: 'auth',
  scope: Scope.DEFAULT,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected usersRepository: UsersOrmRepository,
    protected usersQueryRepository: UsersOrmQueryRepository,
    protected emailManager: EmailManager,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Login Request' })
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
    const newSession: CreateSessionUseCaseDto = {
      userId: req.user.id,
      ip: ip,
      deviceName: req.headers['user-agent'],
    };
    const tokens = await this.commandBus.execute(
      new CreateSessionCommand(newSession),
    );
    return res
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: tokens.accessToken });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async updateRefreshToken(
    @Req() req,
    @Res() res: Response,
    @CurrentPayload() currentPayload,
  ) {
    const tokens = await this.commandBus.execute(
      new UpdateSessionCommand(currentPayload),
    );
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 2000000),
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken: tokens.accessToken });
  }

  @Throttle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myAccount(@CurrentUserId() currentUserId) {
    return this.usersQueryRepository.findUsersByIdOnMyAccount(currentUserId);
  }

  @Post('registration')
  @HttpCode(204)
  async createRegistrationUser(
    @Req() req,
    @Body() inputModel: CreateUserInputModel,
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

    return this.commandBus.execute(new RegistrationUsersCommand(inputModel));
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmationEmail(@Body() inputModel: ConfirmationInputModel) {
    const result = await this.commandBus.execute(
      new ConfirmationEmailCommand(inputModel.code),
    );
    if (!result) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async resendingEmail(@Body() inputModel: RegistrationEmailInputModel) {
    const updateCode = await this.commandBus.execute(
      new UpdateEmailCodeCommand(inputModel.email),
    );
    if (!updateCode) {
      throw new BadRequestException([
        { message: 'Incorrect email', field: 'email' },
      ]);
    }

    const user = await this.usersRepository.findLoginOrEmail(inputModel.email);
    return this.emailManager.sendPasswordRecoveryMessage(user);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async recoveryPassword(@Body() inputModel: RegistrationEmailInputModel) {
    const user = await this.usersRepository.findLoginOrEmail(inputModel.email);
    if (!user) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    await this.commandBus.execute(
      new UpdatePasswordCodeCommand(inputModel.email),
    );

    return this.emailManager.sendNewPasswordMessage(user);
  }

  @Post('new-password')
  @HttpCode(204)
  async confirmationRecoveryPassword(
    @Body() inputModel: NewPasswordInputModel,
  ) {
    const recovery: RecoveryPasswordUserUseCaseDto = {
      code: inputModel.recoveryCode,
      password: inputModel.newPassword,
    };
    const update = await this.commandBus.execute(
      new RecoveryPasswordUserCommand(recovery),
    );
    if (!update) {
      throw new BadRequestException([
        { message: 'Incorrect code', field: 'code' },
      ]);
    }
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logOutAccount(@CurrentPayload() currentPayload) {
    return this.commandBus.execute(
      new DeleteDeviceByDeviceIdCommand(currentPayload.deviceId),
    );
  }
}
