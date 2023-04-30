import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { SessionSqlRepository } from '../../infrastructure/session.sql.repository';
import { SessionOrmRepository } from 'src/session/infrastructure/session.orm.repository';

export class DeleteDeviceByDeviceIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteDeviceByDeviceIdCommand)
export class DeleteDeviceByDeviceIdUseCase
  implements ICommandHandler<DeleteDeviceByDeviceIdCommand>
{
  constructor(private sessionRepository: SessionOrmRepository) {}

  async execute(command: DeleteDeviceByDeviceIdCommand) {
    return this.sessionRepository.deleteDeviceById(command.id);
  }
}
