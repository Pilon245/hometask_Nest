import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/users.query.repository';
import { verifyTokens } from '../helper/generate.token';

@Injectable()
export class BearerAuthGuardOnGet implements CanActivate {
  constructor(private userQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return true;
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokens = await verifyTokens(token);
    if (tokens) {
      req.user = await this.userQueryRepository.findUsersById(tokens.id);
      return true;
    }
    return true;
  }
}
