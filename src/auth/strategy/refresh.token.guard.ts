import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/users.query.repository';
import { SessionQueryRepository } from '../../session/session.query.repository';
import { JwtGenerate } from '../helper/generate.token';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private sessionQueryRepository: SessionQueryRepository,
    private jwtGenerate: JwtGenerate,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const refToken = req.cookies.refreshToken;
    if (!refToken) {
      throw new UnauthorizedException();
    }
    const token = refToken.split(' ')[0];
    const user = await this.jwtGenerate.verifyTokens(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('user', user);
    const foundLastDate =
      await this.sessionQueryRepository.findDevicesByDeviceId(user.deviceId);
    console.log('foundLastDate', foundLastDate);

    if (
      !foundLastDate ||
      foundLastDate.lastActiveDate !== new Date(user.iat * 1000).toISOString()
    ) {
      throw new UnauthorizedException();
    }
    req.user = user;
    console.log('user', user);

    return true;
  }
}