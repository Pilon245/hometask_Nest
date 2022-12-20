import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../users.query.repository';
import { pagination } from '../../validation/query.validation';
import {
  BanAdminUserUseCaseDto,
  BanBloggerUserUseCaseDto,
  BanUserInputModel,
  CreateUserInputModel,
} from '../dto/usersFactory';
import { ApiTags } from '@nestjs/swagger';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create.user.use.cases';
import {
  BanAdminUserCommand,
  BanAdminUserUseCase,
} from '../application/use-cases/ban.admin.user.use.cases';
import { DeleteUserCommand } from '../application/use-cases/delete.user.use.cases';

@UseGuards(BasicAdminGuard)
@ApiTags('sa/users')
@Controller({
  path: 'sa/users',
  scope: Scope.DEFAULT,
})
export class UsersSaController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @Get()
  getUsers(@Query() query) {
    return this.usersQueryRepository.findUsers(pagination(query));
  }
  @Post()
  async createUsers(@Body() inputModel: CreateUserInputModel) {
    const created = await this.commandBus.execute(
      new CreateUserCommand(inputModel),
    );
    if (!created) {
      throw new HttpException('invalid blog', 404);
    }
    return this.usersQueryRepository.findUsersById(created.id);
  }
  @Put(':id/ban')
  @HttpCode(204)
  async updateUsers(
    @Param('id') id: string,
    @Body() inputModel: BanUserInputModel,
  ) {
    const banUser: BanAdminUserUseCaseDto = {
      id: id,
      isBanned: inputModel.isBanned,
      banReason: inputModel.banReason,
    };
    return this.commandBus.execute(new BanAdminUserCommand(banUser));
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteUsers(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    if (!result) {
      throw new HttpException('Incorect Not Found', 404);
    }
    return result;
  }
}
