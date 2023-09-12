import { Injectable, Scope } from '@nestjs/common';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QuizFactory, UpdateQuizFactory } from '../domain/dto/quiz.factory';
import { Users } from '../../users/domain/entities/sql/user.entity';
import { Quiz } from '../domain/entities/sql/quiz.entity';
import { async } from 'rxjs';
import { UpdateQuizCommand } from '../application/use-cases/update.quiz.use.cases';

@Injectable({ scope: Scope.DEFAULT })
export class QuizOrmRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async findQuizById(id: string) {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('answers', 'a')
      .where('quiz.id = :id', { id })
      .getOne();
    return quiz;
  }

  async createQuiz(dto: QuizFactory) {
    const newQuiz = new Quiz();
    newQuiz.id = dto.id;
    newQuiz.body = dto.body;
    newQuiz.correctAnswers = dto.answer;
    newQuiz.published = dto.published;
    newQuiz.createdAt = dto.createdAt;
    newQuiz.updatedAt = dto.updatedAt;

    this.quizRepository.save(newQuiz);

    // dto.answer.map(async (answer) => {
    //   await this.answersRepository.save({
    //     correctAnswers: answer,
    //     quizId: dto.id,
    //   });
    // });
  }

  async updateQuiz(dto: UpdateQuizFactory) {
    const quiz = await this.quizRepository.findOneBy({
      id: dto.id,
    });
    quiz.body = dto.body;
    quiz.correctAnswers = dto.answer;
    return this.quizRepository.save(quiz);
  }
}
