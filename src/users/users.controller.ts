import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query.repository';

@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  getUsers() {
    return this.usersQueryRepository.findUsers();
  }
  @Post()
  createUsers(@Body() inputModel: CreateUserInputModelType) {
    return this.usersService.createUsers(inputModel);
  }
  @Delete(':id')
  deleteUsers(@Param('id') id: string) {
    return this.usersService.deleteUsers(id);
  }
}

export type CreateUserInputModelType = {
  login: string;
  password: string;
  email: string;
};

export type UserOutputModelType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
