import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersSqlRepository } from '../../infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

export class DeleteUsersCommand {}

@CommandHandler(DeleteUsersCommand)
export class DeleteUsersUseCase implements ICommandHandler<DeleteUsersCommand> {
  constructor(private usersRepository: UsersOrmRepository) {}

  async execute() {
    return this.usersRepository.deleteAllUsers();
  }
}
