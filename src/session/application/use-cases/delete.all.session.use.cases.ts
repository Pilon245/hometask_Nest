import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../session.repository';
import { DeleteDevicesUseCaseDto } from '../../dto/create-session.dto';

export class DeleteSessionCommand {}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  async execute() {
    return await this.sessionRepository.deleteAllSessions();
  }
}
