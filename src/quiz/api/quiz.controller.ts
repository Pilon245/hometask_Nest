import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { pagination } from '../../validation/query.validation';
import { ApiTags } from '@nestjs/swagger';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { CommandBus } from '@nestjs/cqrs';
import { QuizOrmQueryRepository } from '../infrastructure/quiz.orm.query.repository';
import { CreateAnswersInputModel } from '../domain/dto/quiz.factory';
import { CreateQuizCommand } from '../application/use-cases/create.quiz.use.cases';
import { UpdateQuizCommand } from '../application/use-cases/update.quiz.use.cases';

@UseGuards(BasicAdminGuard)
@ApiTags('sa/quiz/questions')
@Controller({
  path: 'sa/quiz/questions',
  scope: Scope.DEFAULT,
})
export class QuizController {
  constructor(
    protected quizQueryRepository: QuizOrmQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getQuiz(@Query() query) {
    return this.quizQueryRepository.findQuiz(pagination(query));
  }

  @Post()
  async createQuiz(@Body() inputModel: CreateAnswersInputModel) {
    const created = await this.commandBus.execute(
      new CreateQuizCommand(inputModel),
    );
    if (!created) {
      throw new HttpException('invalid blog', 404);
    }
    return this.quizQueryRepository.findQuizById(created.id);
  }

  @Put(':id')
  async updateQuiz(
    @Param('id') id,
    @Body() inputModel: CreateAnswersInputModel,
  ) {
    const update = await this.commandBus.execute(
      new UpdateQuizCommand({ id: id, ...inputModel }),
    );
    if (!update) {
      throw new HttpException('invalid quiz', 404);
    }
    return this.quizQueryRepository.findQuizById(update.id);
  }

  // @Put(':id/ban')
  // @HttpCode(204)
  // async updateUsers(
  //   @Param('id') id: string,
  //   @Body() inputModel: BanUserInputModel,
  // ) {
  //   const banUser: BanAdminUserUseCaseDto = {
  //     id: id,
  //     isBanned: inputModel.isBanned,
  //     banReason: inputModel.banReason,
  //   };
  //   return this.commandBus.execute(new BanAdminUserCommand(banUser));
  // }
  //
  // @Delete(':id')
  // @HttpCode(204)
  // async deleteUsers(@Param('id') id: string) {
  //   //todo добавить isDeleted
  //   const result = await this.commandBus.execute(new DeleteUserCommand(id));
  //   if (!result) {
  //     throw new HttpException('Incorect Not Found', 404);
  //   }
  //   return result;
  // }
}
