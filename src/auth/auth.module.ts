import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersQueryRepository } from '../users/users.query.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/users.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';
import { SessionModule } from '../session/session.module';
import { UsersRepository } from '../users/users.repository';
import { BearerAuthGuardOnGet } from './strategy/bearer-auth-guard-on-get.service';
import { OptionalBearerAuthGuard } from './strategy/optional.bearer.auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtGenerate } from './helper/generate.token';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './strategy/forbiten.giard';
import { RefreshTokenGuard } from './strategy/refresh.token.guard';
const result = new ConfigService().get<string>('ACCESS_JWT_SECRET');
console.log('result', result);

@Module({
  imports: [
    PassportModule,
    UsersModule,
    SessionModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: result,
      signOptions: { expiresIn: '7m' },
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
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
    OptionalBearerAuthGuard,
    JwtGenerate,
    AuthGuard,
    RefreshTokenGuard,
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    EmailAdapter,
    PasswordEmailAdapter,
    BearerAuthGuardOnGet,
    OptionalBearerAuthGuard,
    JwtGenerate,
    AuthGuard,
    RefreshTokenGuard,
    EmailAdapter,
  ],
})
export class AuthModule {}

// MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
