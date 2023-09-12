import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { _generatePasswordForDb } from 'src/helper/auth.function';
import { QuizOrmQueryRepository } from '../../infrastructure/quiz.orm.query.repository';
import {
  CreateQuizUseCaseDto,
  QuizFactory,
  UpdateQuizFactory,
  UpdateQuizUseCaseDto,
} from '../../domain/dto/quiz.factory';
import { QuizOrmRepository } from '../../infrastructure/quiz.orm.repository';

export class UpdateQuizCommand {
  constructor(public updateUseCase: UpdateQuizUseCaseDto) {}
}

@CommandHandler(UpdateQuizCommand)
export class UpdateUserUseCase implements ICommandHandler<UpdateQuizCommand> {
  constructor(private quizRepository: QuizOrmRepository) {}

  async execute(command: UpdateQuizCommand) {
    const findQuiz = await this.quizRepository.findQuizById(
      command.updateUseCase.id,
    );
    if (!findQuiz) return false;
    const updateQuiz = new UpdateQuizFactory(
      command.updateUseCase.id,
      command.updateUseCase.body,
      JSON.stringify(command.updateUseCase.correctAnswers),
    );
    await this.quizRepository.updateQuiz(updateQuiz);
    return updateQuiz;
  }
}
