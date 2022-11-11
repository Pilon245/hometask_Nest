import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query.repository';
import { pagination } from '../middlewares/query.validation';

@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  getUsers(@Query() query) {
    return this.usersQueryRepository.findUsers(pagination(query));
  }
  @Post()
  createUsers(@Body() inputModel: CreateUserInputModelType) {
    return this.usersService.createUsers(inputModel);
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteUsers(@Param('id') id: string) {
    // const resultFound = await this.postsQueryRepository.findPostById(postId);
    // if (!resultFound) {
    //   throw new HttpException('invalid blog', 404);
    // }
    const result = await this.usersService.deleteUsers(id);
    console.log('result', result);
    if (!result) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
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
