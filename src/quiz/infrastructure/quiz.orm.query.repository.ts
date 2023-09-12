import { Injectable, Scope } from '@nestjs/common';
import {
  banStatusEnum,
  publishedStatusEnum,
  SortDirection,
} from '../../validation/query.validation';

import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import { Users } from '../../users/domain/entities/sql/user.entity';
import { Quiz } from '../domain/entities/sql/quiz.entity';

export type FindUsersPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  bodySearchTerm: string;
  publishedStatus: publishedStatusEnum;
};

@Injectable({ scope: Scope.DEFAULT })
export class QuizOrmQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async findQuiz({
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
    publishedStatus,
    bodySearchTerm,
  }: FindUsersPayload) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const quiz = await this.dataSource.query(
      `SELECT q.*, a.* FROM quiz AS q
             INNER JOIN "answers" AS a
             ON a."quizId"  = q."id"
             WHERE q."body" = '${bodySearchTerm}' and q."published" = '${publishedStatus}'
             ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*)FROM quiz AS q
             INNER JOIN "answers" AS a
             ON a."quizId"  = q."id"
             WHERE q."body" = '${bodySearchTerm}' and q."published" = '${publishedStatus}'
             ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const totalCount = +valueCount[0].count;
    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: quiz.map((q) => ({
        id: q.id,
        body: q.body,
        correctAnswers: q.correctAnswers,
        published: q.published,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
    };
  }

  async findQuizById(id: string) {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('answers', 'a')
      .where('quiz.id = :id', { id })
      .getOne();
    return quiz;
  }
}
