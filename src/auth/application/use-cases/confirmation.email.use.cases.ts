import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';

export class ConfirmationEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationEmailCommand)
export class ConfirmationEmailUseCase
  implements ICommandHandler<ConfirmationEmailCommand>
{
  constructor(private usersRepository: UsersSqlRepository) {}

  async execute(command: ConfirmationEmailCommand) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      command.code,
    );
    if (!user) return false;
    return this.usersRepository.updateEmailConfirmation(user.id);
  }
}
