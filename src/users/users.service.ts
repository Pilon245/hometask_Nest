import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModel, CreateUsersDto } from './dto/create.users.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APP_GUARD } from '@nestjs/core';
// import { _generatePasswordForDb } from '../helper/auth.function';
//todo 429 ошибку делать по другому на несте
@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}

  createUsers(inputModel: CreateUserInputModel) {
    // const passwordHash = _generatePasswordForDb(inputModel.password);
    // const password = passwordHash.then();
    // console.log('passwordHash', passwordHash);
    // console.log('password', password);
    const newUser = new CreateUsersDto(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash: 'sadda',
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
