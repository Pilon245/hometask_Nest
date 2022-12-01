import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { AuthService } from '../auth/auth.service';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';
import { UsersModule } from '../users/users.module';
import { SessionQueryRepository } from './session.query.repository';
import { JwtGenerate } from '../auth/helper/generate.token';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UsersModule,
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
