import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/entities/nosql/users.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';
import { SessionModule } from '../session/session.module';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { BearerAuthGuardOnGet } from './guards/bearer-auth-guard-on-get.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtGenerate } from './helper/generate.token';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { BasicAdminGuard } from './guards/basic-admin.guard';
import {
  BloggerUsersBan,
  BloggerUsersBanSchema,
} from '../users/domain/entities/nosql/blogger.users.blogs.ban.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateSessionUseCase } from '../session/application/use-cases/create.session.use.cases';
import { UpdateSessionUseCase } from '../session/application/use-cases/update.session.use.cases';
import { ConfirmationEmailUseCase } from './application/use-cases/confirmation.email.use.cases';
import { RecoveryPasswordUserUseCase } from './application/use-cases/recovery.password.user.use.cases';
import { RegistrationUsersUseCase } from './application/use-cases/registration.users.use.cases';
import { UpdateEmailCodeUseCase } from './application/use-cases/update.email.code.use.cases';
import { UpdatePasswordCodeUseCase } from './application/use-cases/update.password.code.use.cases';
import { UsersSqlRepository } from '../users/infrastructure/users.sql.repository';

const result = new ConfigService().get<string>('ACCESS_JWT_SECRET');

const authUseCase = [
  CreateSessionUseCase,
  UpdateSessionUseCase,
  ConfirmationEmailUseCase,
  RecoveryPasswordUserUseCase,
  RegistrationUsersUseCase,
  UpdateEmailCodeUseCase,
  UpdatePasswordCodeUseCase,
];

@Module({
  imports: [
    PassportModule,
    UsersModule,
    SessionModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BloggerUsersBan.name, schema: BloggerUsersBanSchema },
    ]),
    JwtModule.register({
      secret: result,
      signOptions: { expiresIn: '7m' },
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersQueryRepository,
    EmailManager,
    EmailAdapter,
    PasswordEmailAdapter,
    UsersRepository,
    BearerAuthGuardOnGet,
    JwtGenerate,
    RefreshTokenGuard,
    BasicAdminGuard,
    ...authUseCase,
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    EmailAdapter,
    PasswordEmailAdapter,
    BearerAuthGuardOnGet,
    JwtGenerate,
    RefreshTokenGuard,
    EmailAdapter,
  ],
})
export class AuthModule {}
