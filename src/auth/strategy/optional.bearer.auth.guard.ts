import { ExecutionContext, Injectable } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { BearerAuthGuard } from './bearer.auth.guard';

@Injectable()
export class OptionalBearerAuthGuard extends BearerAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      return true;
    }
  }
}
