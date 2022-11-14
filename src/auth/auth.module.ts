import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UsersQueryRepository } from '../users/users.query.repository';

@Module({
  imports: [
    UsersController,
    UsersService,
    UsersQueryRepository,
    UsersRepository,
  ], //todo тут это как работает
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
