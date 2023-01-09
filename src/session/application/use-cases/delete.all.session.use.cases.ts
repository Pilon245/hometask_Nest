import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { SessionSqlRepository } from '../../infrastructure/session.sql.repository';

export class DeleteSessionCommand {}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepository: SessionSqlRepository) {}

  async execute() {
    return await this.sessionRepository.deleteAllSessions();
  }
}
