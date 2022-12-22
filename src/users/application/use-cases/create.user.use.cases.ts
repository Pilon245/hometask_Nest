import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { CreateUserUseCaseDto, UsersFactory } from '../../domain/dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class CreateUserCommand {
  constructor(public createUseCase: CreateUserUseCaseDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: CreateUserCommand) {
    const passwordHash = await _generatePasswordForDb(
      command.createUseCase.password,
    );
    const newUser = new UsersFactory(
      String(+new Date()),
      {
        login: command.createUseCase.login,
        email: command.createUseCase.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    );
    await this.usersRepository.createUsers(newUser);
    return newUser;
  }
}