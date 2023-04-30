import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

export class UpdateEmailCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(UpdateEmailCodeCommand)
export class UpdateEmailCodeUseCase
  implements ICommandHandler<UpdateEmailCodeCommand>
{
  constructor(private usersRepository: UsersOrmRepository) {}

  async execute(command: UpdateEmailCodeCommand) {
    const user = await this.usersRepository.findLoginOrEmail(command.email);
    if (!user || user.emailConfirmation.isConfirmed) return false;
    const newCode = randomUUID();
    return this.usersRepository.updateEmailCode(user.id, newCode);
  }
}
