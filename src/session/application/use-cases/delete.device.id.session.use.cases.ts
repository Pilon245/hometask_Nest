import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { SessionSqlRepository } from '../../infrastructure/session.sql.repository';

export class DeleteDeviceByDeviceIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteDeviceByDeviceIdCommand)
export class DeleteDeviceByDeviceIdUseCase
  implements ICommandHandler<DeleteDeviceByDeviceIdCommand>
{
  constructor(private sessionRepository: SessionSqlRepository) {}

  async execute(command: DeleteDeviceByDeviceIdCommand) {
    return this.sessionRepository.deleteDeviceById(command.id);
  }
}
