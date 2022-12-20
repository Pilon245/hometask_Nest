import { Module } from '@nestjs/common';
import { SessionService } from './application/session.service';
import { SessionController } from './api/session.controller';
import { SessionRepository } from './session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { AuthService } from '../auth/application/auth.service';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';
import { UsersModule } from '../users/users.module';
import { SessionQueryRepository } from './session.query.repository';
import { JwtGenerate } from '../auth/helper/generate.token';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UsersModule,
    CqrsModule,
  ],
  controllers: [SessionController],
  providers: [
    SessionService,
    SessionRepository,
    AuthService,
    SessionQueryRepository,
    JwtGenerate,
    EmailManager,
    EmailAdapter,
    PasswordEmailAdapter,
  ],
  exports: [SessionService, SessionRepository, SessionQueryRepository],
})
export class SessionModule {}
