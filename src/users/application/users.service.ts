import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersSqlRepository } from '../infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(protected usersRepository: UsersOrmRepository) {}
}
