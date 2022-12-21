import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';

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
