import { ThrottlerGuard } from '@nestjs/throttler';
import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const reqType = context.getType<ContextType>();
    if (reqType === 'http') {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }
  }
}
