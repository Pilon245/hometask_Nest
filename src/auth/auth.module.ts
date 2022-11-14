import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UsersQueryRepository } from '../users/users.query.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersController,
    UsersService,
    UsersQueryRepository,
    UsersRepository,
    PassportModule,
  ], //todo тут это как работает
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
