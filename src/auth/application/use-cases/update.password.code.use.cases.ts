import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

export class UpdatePasswordCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(UpdatePasswordCodeCommand)
export class UpdatePasswordCodeUseCase
  implements ICommandHandler<UpdatePasswordCodeCommand>
{
  constructor(private usersRepository: UsersOrmRepository) {}

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
