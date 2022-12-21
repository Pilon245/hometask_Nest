import { Injectable, Scope } from '@nestjs/common';

import { SessionRepository } from '../infrastructure/session.repository';
import { JwtGenerate } from '../../auth/helper/generate.token';

@Injectable({ scope: Scope.DEFAULT })
export class SessionService {
  constructor(
    protected sessionRepository: SessionRepository,
    protected jwtGenerate: JwtGenerate,
  ) {}
}
