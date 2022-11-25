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
export class BearerAuthGuard implements CanActivate {
  constructor(private userQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    console.log('req', req.headers.authorization);
    if (!req.headers.authorization) {
      console.log('req.user Bearer1', req.user);
      return true;
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log('token', token);
    const tokens = await verifyTokens(token);
    console.log('tokens', tokens);

    if (tokens) {
      req.user = await this.userQueryRepository.findUsersById(tokens.id);
      console.log('req.user Bearer2', req.user);
      return true;
    }
    console.log('req.user Bearer3', req.user);

    return true;
  }
}
