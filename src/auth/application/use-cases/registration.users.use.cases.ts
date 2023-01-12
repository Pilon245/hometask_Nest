import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { _generatePasswordForDb } from '../../../helper/auth.function';
import { UsersFactory } from '../../../users/domain/dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailManager } from '../../../managers/email.manager';
import { RegistrationUsersUseCaseDto } from '../../domain/dto/create-auth.dto';
import { UsersSqlRepository } from '../../../users/infrastructure/users.sql.repository';

export class RegistrationUsersCommand {
  constructor(public registrationUseCaseDto: RegistrationUsersUseCaseDto) {}
}

@CommandHandler(RegistrationUsersCommand)
export class RegistrationUsersUseCase
  implements ICommandHandler<RegistrationUsersCommand>
{
  constructor(
    private emailManager: EmailManager,
    private usersRepository: UsersSqlRepository,
  ) {}

  async execute(command: RegistrationUsersCommand) {
    const passwordHash = await _generatePasswordForDb(
      command.registrationUseCaseDto.password,
    );
    const newUser = new UsersFactory(
      String(+new Date()),
      {
        login: command.registrationUseCaseDto.login,
        email: command.registrationUseCaseDto.email,
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
        banDate: new Date().toISOString(),
        banReason: 'string',
      },
    );
    await this.emailManager.sendPasswordRecoveryMessage(newUser);
    await this.usersRepository.createUsers(newUser);
    return newUser;
  }
}
