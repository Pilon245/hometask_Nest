import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModel, CreateFactory } from './dto/createFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APP_GUARD } from '@nestjs/core';
import { _generatePasswordForDb } from '../helper/auth.function';
import * as bcrypt from 'bcrypt';
// import { _generatePasswordForDb } from '../helper/auth.function';
@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}

  async createUsers(inputModel: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    // const password = passwordHash.then();
    const createdUsers = await this.userRepository.findLoginOrEmail(
      inputModel.login,
    );
    if (createdUsers) return false;
    console.log('passwordHash', passwordHash);
    // console.log('password', password);
    const newUser = new CreateFactory(
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
    );
    this.userRepository.createUsers(newUser);
    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
  async checkCredentials(loginOrEmail: string, password: string) {
    //todo !!!ПЕРЕНСТИ ЭТО В ГВАРД ИЛИ ФУНКИЦЮ!!!
    const user = await this.userRepository.findLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }
  async checkRefreshToken(loginOrEmail: string) {
    const user = await this.userRepository.findLoginOrEmail(loginOrEmail);
    if (!user) {
      return false;
    }
    return user;
  }

  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
}
