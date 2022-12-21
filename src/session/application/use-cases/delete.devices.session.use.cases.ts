import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { DeleteDevicesUseCaseDto } from '../../domain/dto/create-session.dto';

export class DeleteDevicesCommand {
  constructor(public deleteUseCaseDto: DeleteDevicesUseCaseDto) {}
}

@CommandHandler(DeleteDevicesCommand)
export class DeleteDevicesUseCase
  implements ICommandHandler<DeleteDevicesCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: DeleteDevicesCommand) {
    return this.sessionRepository.deleteDevices(
      command.deleteUseCaseDto.id,
      command.deleteUseCaseDto.deviceId,
    );
  }
}
