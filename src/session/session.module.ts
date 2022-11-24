import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/users.entity';
import { Session, SessionSchema } from './entities/session.entity';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/strategy/local.strategy';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { EmailManager } from '../managers/email.manager';
import { EmailAdapter } from '../adapters/emailAdapter';
import { PasswordEmailAdapter } from '../adapters/password-email-adapter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
