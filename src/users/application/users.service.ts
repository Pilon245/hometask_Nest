import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
}
