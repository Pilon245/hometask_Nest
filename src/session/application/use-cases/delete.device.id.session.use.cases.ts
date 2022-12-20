import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../session.repository';

export class DeleteDeviceByDeviceIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteDeviceByDeviceIdCommand)
export class DeleteDeviceByDeviceIdUseCase
  implements ICommandHandler<DeleteDeviceByDeviceIdCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: DeleteDeviceByDeviceIdCommand) {
    return this.sessionRepository.deleteDeviceById(command.id);
  }
}
