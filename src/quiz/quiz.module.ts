import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './domain/entities/sql/quiz.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizController } from './api/quiz.controller';
import { QuizOrmQueryRepository } from './infrastructure/quiz.orm.query.repository';
import { QuizOrmRepository } from './infrastructure/quiz.orm.repository';

const quizUseCase = [];

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]), CqrsModule],
  controllers: [QuizController],
  providers: [...quizUseCase, QuizOrmQueryRepository, QuizOrmRepository],
  exports: [],
})
export class QuizModule {}
