import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreatePostInputModelType,
  PostOutputModelType,
} from '../posts/posts.controller';
import {
  CreateUserInputModelType,
  UserOutputModelType,
} from './users.controller';

@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}

  findUsers() {
    return this.userRepository.findUsers();
  }

  createUsers(inputModel: CreateUserInputModelType) {
    const newUser = {
      id: String(+new Date()),
      login: inputModel.login,
      password: inputModel.password,
      email: inputModel.email,
      createdAt: new Date().toISOString(),
    };
    return this.userRepository.createUsers(newUser);
  }
  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
  deleteAllUsers() {
    return this.userRepository.deleteAllUsers();
  }
}
