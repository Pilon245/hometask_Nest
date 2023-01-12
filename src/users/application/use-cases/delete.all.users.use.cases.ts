import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersSqlRepository } from '../../infrastructure/users.sql.repository';

export class DeleteUsersCommand {}

@CommandHandler(DeleteUsersCommand)
export class DeleteUsersUseCase implements ICommandHandler<DeleteUsersCommand> {
  constructor(private usersRepository: UsersSqlRepository) {}

  async execute() {
    return this.usersRepository.deleteAllUsers();
  }
}
