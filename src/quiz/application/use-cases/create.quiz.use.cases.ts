import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { _generatePasswordForDb } from 'src/helper/auth.function';
import { QuizOrmQueryRepository } from '../../infrastructure/quiz.orm.query.repository';
import {
  CreateQuizUseCaseDto,
  QuizFactory,
} from '../../domain/dto/quiz.factory';
import { QuizOrmRepository } from '../../infrastructure/quiz.orm.repository';

export class CreateQuizCommand {
  constructor(public createUseCase: CreateQuizUseCaseDto) {}
}

@CommandHandler(CreateQuizCommand)
export class CreateUserUseCase implements ICommandHandler<CreateQuizCommand> {
  constructor(private quizRepository: QuizOrmRepository) {}

  async execute(command: CreateQuizCommand) {
    const newQuiz = new QuizFactory(
      String(+new Date()),
      command.createUseCase.body,
      JSON.stringify(command.createUseCase.correctAnswers),
      false,
      new Date().toISOString(),
      new Date().toISOString(),
    );
    await this.quizRepository.createQuiz(newQuiz);
    return newQuiz;
  }
}
