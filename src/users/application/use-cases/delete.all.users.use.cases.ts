import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUsersCommand {}

@CommandHandler(DeleteUsersCommand)
export class DeleteUsersUseCase implements ICommandHandler<DeleteUsersCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    return this.usersRepository.deleteAllUsers();
  }
}
