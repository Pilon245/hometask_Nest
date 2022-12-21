import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { randomUUID } from 'crypto';
import {
  CreateSessionUseCaseDto,
  DeleteDevicesUseCaseDto,
  SessionFactory,
} from '../../domain/dto/create-session.dto';
import { JwtGenerate } from '../../../auth/helper/generate.token';

export class UpdateSessionCommand {
  constructor(public updateUseCaseDto: DeleteDevicesUseCaseDto) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(
    private sessionRepository: SessionRepository,
    private jwtGenerate: JwtGenerate,
  ) {}

  async execute(command: UpdateSessionCommand) {
    const tokens = await this.jwtGenerate.generateTokens(
      command.updateUseCaseDto.id,
      command.updateUseCaseDto.deviceId,
    );
    const payload = await this.jwtGenerate.verifyTokens(tokens.refreshToken);
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    await this.sessionRepository.updateSecurityDevices(
      command.updateUseCaseDto.id,
      payload.deviceId,
      lastActiveDate,
    );
    return tokens;
  }
}
