import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
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
// import { AuthGuard } from '../helper/auth.guard';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    SessionModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7m' },
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
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    EmailAdapter,
    PasswordEmailAdapter,
  ],
})
export class AuthModule {}

// MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
