import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { SessionSqlRepository } from '../../infrastructure/session.sql.repository';
import { SessionOrmRepository } from 'src/session/infrastructure/session.orm.repository';

export class DeleteSessionCommand {}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepository: SessionOrmRepository) {}

  async execute() {
    return await this.sessionRepository.deleteAllSessions();
  }
}
