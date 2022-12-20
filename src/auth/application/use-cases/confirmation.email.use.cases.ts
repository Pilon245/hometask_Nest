import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { UsersFactory } from '../../../users/dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailManager } from '../../../managers/email.manager';
import { RegistrationUsersUseCaseDto } from '../../dto/create-auth.dto';

export class ConfirmationEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationEmailCommand)
export class ConfirmationEmailUseCase
  implements ICommandHandler<ConfirmationEmailCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmationEmailCommand) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      command.code,
    );
    if (!user) return false;
    return this.usersRepository.updateEmailConfirmation(user.id);
  }
}
