import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './domain/entities/sql/quiz.entity';
import { Answers } from './domain/entities/sql/answers.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizSaController } from './api/quiz.sa.controller';

const quizUseCase = [];

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Answers]), CqrsModule],
  controllers: [QuizSaController],
  providers: [...quizUseCase],
  exports: [],
})
export class QuizModule {}
