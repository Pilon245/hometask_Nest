import { Module } from '@nestjs/common';
import { SessionService } from './application/session.service';
import { SessionController } from './api/session.controller';
import { SessionRepository } from './infrastructure/session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './domain/entities/session.entity';
import { AuthService } from '../auth/application/auth.service';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';
import { UsersModule } from '../users/users.module';
import { SessionQueryRepository } from './infrastructure/session.query.repository';
import { JwtGenerate } from '../auth/helper/generate.token';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersSqlRepository } from '../users/infrastructure/users.sql.repository';
import { SessionSqlQueryRepository } from './infrastructure/session.sql.query.repository';
import { SessionSqlRepository } from './infrastructure/session.sql.repository';

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
    SessionSqlQueryRepository,
    SessionSqlRepository,
  ],
  exports: [
    SessionService,
    SessionRepository,
    SessionQueryRepository,
    SessionSqlRepository,
    SessionSqlQueryRepository,
  ],
})
export class SessionModule {}
