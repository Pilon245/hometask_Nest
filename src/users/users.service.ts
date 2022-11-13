import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModel, CreateUsersDto } from './dto/create.users.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}

  createUsers(inputModel: CreateUserInputModel) {
    const newUser = new CreateUsersDto(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash: 'sdasdsada',
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
    );
    this.userRepository.createUsers(newUser);
    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
}
