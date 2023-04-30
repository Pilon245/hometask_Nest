import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

export class ConfirmationEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationEmailCommand)
export class ConfirmationEmailUseCase
  implements ICommandHandler<ConfirmationEmailCommand>
{
  constructor(private usersRepository: UsersOrmRepository) {}

  async execute(command: ConfirmationEmailCommand) {
    const user = await this.usersRepository.findUserByConfirmationEmailCode(
      command.code,
    );
    if (!user || user.emailConfirmation.isConfirmed) return false;
    return this.usersRepository.updateEmailConfirmation(user.id);
  }
}
