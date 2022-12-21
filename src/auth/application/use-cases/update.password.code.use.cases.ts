import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';

export class UpdatePasswordCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(UpdatePasswordCodeCommand)
export class UpdatePasswordCodeUseCase
  implements ICommandHandler<UpdatePasswordCodeCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: UpdatePasswordCodeCommand) {
    const user = await this.usersRepository.findLoginOrEmail(command.email);
    if (!user) {
      return false;
    }
    const newCode = randomUUID();
    if (user) {
      return this.usersRepository.updatePasswordCode(user.id, newCode);
    }
    return true;
  }
}
