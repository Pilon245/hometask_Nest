import { Module } from '@nestjs/common';
import { SessionService } from './application/session.service';
import { SessionController } from './api/session.controller';
import { SessionRepository } from './infrastructure/session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './domain/entities/nosql/session.entity';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions } from './domain/entities/sql/session.entity';
import { SessionOrmQueryRepository } from 'src/session/infrastructure/session.orm.query.repository';
import { SessionOrmRepository } from 'src/session/infrastructure/session.orm.repository';
import { Blogs } from 'src/blogs/domain/entities/sql/blog.entity';
import { BlogsBanInfo } from 'src/blogs/domain/entities/sql/blogs.ban.info.entity';
import { Posts } from 'src/posts/domain/entities/sql/posts.entity';
import { LikePosts } from 'src/posts/domain/entities/sql/like.posts.entity';
import { LikeComments } from 'src/comments/domain/entities/sql/like.comments.entity';
import { Comments } from 'src/comments/domain/entities/sql/comments.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    TypeOrmModule.forFeature([
      Sessions,
      Blogs,
      BlogsBanInfo,
      Posts,
      LikePosts,
      LikeComments,
      Comments,
    ]),
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
    SessionOrmQueryRepository,
    SessionOrmRepository,
  ],
  exports: [
    SessionService,
    SessionRepository,
    SessionQueryRepository,
    SessionSqlRepository,
    SessionSqlQueryRepository,
    SessionOrmQueryRepository,
    SessionOrmRepository,
  ],
})
export class SessionModule {}
