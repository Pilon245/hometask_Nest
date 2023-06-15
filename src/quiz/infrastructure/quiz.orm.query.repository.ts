import { Injectable, Scope } from '@nestjs/common';
import {
  banStatusEnum,
  SortDirection,
} from '../../validation/query.validation';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export type FindUsersPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  banStatus?: banStatusEnum;
};

@Injectable({ scope: Scope.DEFAULT })
export class QuizOrmQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
}
