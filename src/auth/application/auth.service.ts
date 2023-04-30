import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../../session/application/session.service';
import { CreateSessionUseCaseDto } from '../../session/domain/dto/create-session.dto';
import { CreateSessionCommand } from '../../session/application/use-cases/create.session.use.cases';
import { CommandBus } from '@nestjs/cqrs';
import { UsersSqlRepository } from '../../users/infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    protected usersRepository: UsersOrmRepository,
    private sessionService: SessionService,
    private commandBus: CommandBus,
  ) {}

  async validateUser(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepository.findLoginOrEmail(LoginOrEmail);
    console.log('user', user);
    if (!user || user.banInfo.isBanned) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }

  async login(req: any) {
    const newSession: CreateSessionUseCaseDto = {
      userId: req.user.id,
      ip: req.ip,
      deviceName: req.headers['user-agent'],
    };
    return this.commandBus.execute(new CreateSessionCommand(newSession));
  }
}

//todo как нужно сервис к чужому репозиторию или к другому сервису
