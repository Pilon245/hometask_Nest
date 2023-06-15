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
import { pagination } from '../../validation/query.validation';
import {
  BanAdminUserUseCaseDto,
  BanUserInputModel,
  CreateUserInputModel,
} from '../domain/dto/usersFactory';
import { ApiTags } from '@nestjs/swagger';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create.user.use.cases';
import { BanAdminUserCommand } from '../application/use-cases/ban.admin.user.use.cases';
import { DeleteUserCommand } from '../application/use-cases/delete.user.use.cases';
import { QuizOrmQueryRepository } from '../infrastructure/quiz.orm.query.repository';

@UseGuards(BasicAdminGuard)
@ApiTags('sa/quiz/questions')
@Controller({
  path: 'sa/users',
  scope: Scope.DEFAULT,
})
export class QuizSaController {
  constructor(
    protected usersQueryRepository: QuizOrmQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getUsers(@Query() query) {
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
    //todo добавить isDeleted
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    if (!result) {
      throw new HttpException('Incorect Not Found', 404);
    }
    return result;
  }
}
