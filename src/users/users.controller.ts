import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.findUsers();
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
