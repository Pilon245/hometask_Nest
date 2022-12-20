import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { UsersFactory } from '../../../users/dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailManager } from '../../../managers/email.manager';
import { RegistrationUsersUseCaseDto } from '../../dto/create-auth.dto';

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
