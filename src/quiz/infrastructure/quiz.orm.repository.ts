import { Injectable, Scope } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class QuizOrmRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
}
