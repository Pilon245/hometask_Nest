import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersSqlRepository } from '../../infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersOrmRepository) {}

  async execute(command: DeleteUserCommand) {
    return this.usersRepository.deleteUsers(command.id);
  }
}
