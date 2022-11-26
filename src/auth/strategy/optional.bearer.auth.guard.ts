import { ExecutionContext, Injectable } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { BearerAuthGuardOnGet } from './bearer-auth-guard-on-get.service';

@Injectable()
export class OptionalBearerAuthGuard extends BearerAuthGuardOnGet {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      return true;
    }
  }
}
