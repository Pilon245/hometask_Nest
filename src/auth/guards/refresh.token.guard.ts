import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { SessionQueryRepository } from '../../session/infrastructure/session.query.repository';
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
    const user = await this.jwtGenerate.verifyTokens(refToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    const foundLastDate =
      await this.sessionQueryRepository.findDevicesByDeviceId(user.deviceId);
    if (
      !foundLastDate ||
      foundLastDate.lastActiveDate !== new Date(user.iat * 1000).toISOString()
    ) {
      throw new UnauthorizedException();
    }
    // req.user = user;
    req.user = await this.usersQueryRepository.findUsersById(user.id);
    return true;
  }
}
