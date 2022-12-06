import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModel, UsersFactory } from './dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { _generatePasswordForDb } from '../helper/auth.function';

console.log('www');
@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}
  async createUsers(inputModel: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    const newUser = new UsersFactory(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
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
    await this.userRepository.createUsers(newUser);
    return newUser;
  }

  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
  async deleteAllUsers() {
    return await this.userRepository.deleteAllUsers();
  }
}
