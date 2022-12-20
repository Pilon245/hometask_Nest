import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { UsersFactory } from '../../../users/dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailManager } from '../../../managers/email.manager';
import { RegistrationUsersUseCaseDto } from '../../dto/create-auth.dto';

export class UpdateEmailCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(UpdateEmailCodeCommand)
export class UpdateEmailCodeUseCase
  implements ICommandHandler<UpdateEmailCodeCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: UpdateEmailCodeCommand) {
    const user = await this.usersRepository.findLoginOrEmail(command.email);
    if (!user || user.emailConfirmation.isConfirmed) return false;
    const newCode = randomUUID();
    return this.usersRepository.updateEmailCode(user.id, newCode);
  }
}
