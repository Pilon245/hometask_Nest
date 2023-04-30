import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { randomUUID } from 'crypto';
import {
  CreateSessionUseCaseDto,
  SessionFactory,
} from '../../domain/dto/create-session.dto';
import { JwtGenerate } from '../../../auth/helper/generate.token';
import { SessionSqlRepository } from '../../infrastructure/session.sql.repository';
import { SessionOrmRepository } from 'src/session/infrastructure/session.orm.repository';

export class CreateSessionCommand {
  constructor(public createUseCaseDto: CreateSessionUseCaseDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    private sessionRepository: SessionOrmRepository,
    private jwtGenerate: JwtGenerate,
  ) {}

  async execute(command: CreateSessionCommand) {
    const deviceId = String(randomUUID());
    const tokens = await this.jwtGenerate.generateTokens(
      command.createUseCaseDto.userId,
      deviceId,
    );
    const payload = await this.jwtGenerate.verifyTokens(
      tokens.refreshToken.split(' ')[0],
    );
    const session = new SessionFactory(
      command.createUseCaseDto.ip,
      command.createUseCaseDto.deviceName,
      new Date(payload.iat * 1000).toISOString(),
      new Date(payload.iat * 1000).toDateString(),
      deviceId,
      command.createUseCaseDto.userId,
    );
    await this.sessionRepository.createSecurityDevices(session);
    return tokens;
  }
}
