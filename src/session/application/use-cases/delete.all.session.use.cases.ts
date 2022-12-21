import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { DeleteDevicesUseCaseDto } from '../../domain/dto/create-session.dto';

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
