import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { RecoveryPasswordUserUseCaseDto } from '../../domain/dto/registration.dto';

export class RecoveryPasswordUserCommand {
  constructor(public recoveryUseCaseDto: RecoveryPasswordUserUseCaseDto) {}
}

@CommandHandler(RecoveryPasswordUserCommand)
export class RecoveryPasswordUserUseCase
  implements ICommandHandler<RecoveryPasswordUserCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: RecoveryPasswordUserCommand) {
    const user = await this.usersRepository.findUserByConfirmationPasswordCode(
      command.recoveryUseCaseDto.code,
    );
    if (!user) return false;
    const passwordHash = await _generatePasswordForDb(
      command.recoveryUseCaseDto.password,
    );
    await this.usersRepository.updatePasswordConfirmation(user.id);
    return this.usersRepository.updatePasswordUsers(user.id, passwordHash);
  }
}
