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
import { extendedLikesInfoType } from '../posts/posts.service';

@Injectable()
export class UsersService {
  constructor(protected userRepository: UsersRepository) {}

  createUsers(inputModel: CreateUserInputModelType) {
    const newUser = new CreateUsersDto(
      String(+new Date()),
      inputModel.login,
      inputModel.password,
      inputModel.email,
      new Date().toISOString(),
    );
    this.userRepository.createUsers(newUser);
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }
  deleteUsers(id: string) {
    return this.userRepository.deleteUsers(id);
  }
}

export class CreateUsersDto {
  constructor(
    public id: string,
    public login: string,
    public password: string,
    public email: string,
    public createdAt: string,
  ) {}
}
