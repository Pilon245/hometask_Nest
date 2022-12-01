import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomThrottlerGuard } from './custom.throttler.guard';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
