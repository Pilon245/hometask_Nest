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
  Scope,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query.repository';
import { pagination } from '../validation/query.validation';
import { CreateUserInputModel } from './dto/usersFactory';
import { BasicAuthGuard } from '../auth/strategy/basic-auth.guard';

@Controller({
  path: 'sa/users',
  scope: Scope.DEFAULT,
})
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Get()
  getUsers(@Query() query) {
    return this.usersQueryRepository.findUsers(pagination(query));
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  async createUsers(@Body() inputModel: CreateUserInputModel) {
    const created = await this.usersService.createUsers(inputModel);
    if (!created) {
      throw new HttpException('invalid blog', 404);
    }
    return this.usersQueryRepository.findUsersById(created.id);
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUsers(@Param('id') id: string) {
    const result = await this.usersService.deleteUsers(id);
    if (!result) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }
}
