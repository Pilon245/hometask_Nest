import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModel, UsersFactory } from './dto/usersFactory';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APP_GUARD } from '@nestjs/core';
import { _generatePasswordForDb } from '../helper/auth.function';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
// import { _generatePasswordForDb } from '../helper/auth.function';
@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}
  async registrationUsers(
    inputModel: CreateUserInputModel,
  ): Promise<User | string> {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    const createdLoginUsers = await this.userRepository.findLogin(
      inputModel.login,
    );
    if (createdLoginUsers) {
      var login = { login: 'Created Login' };
    }

    const createdEmailUsers = await this.userRepository.findEmail(
      inputModel.email,
    );
    if (createdEmailUsers) {
      var email = { email: 'Created Email' };
    }
    console.log('{ login, email }', ` ${login.login}, ${email.email} `);
    if (createdLoginUsers || createdEmailUsers)
      return `${login.login}, ${email.email}`;
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
  async createUsers(inputModel: CreateUserInputModel) {
    const passwordHash = await _generatePasswordForDb(inputModel.password);
    const createdUsers = await this.userRepository.findLoginAndEmail(
      inputModel.login,
      inputModel.email,
    );
    if (createdUsers) return false;
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
  async deleteAllUsers() {
    return await this.userRepository.deleteAllUsers();
  }
}
