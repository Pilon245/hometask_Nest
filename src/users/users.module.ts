import { Module } from '@nestjs/common';
import { UsersSaController } from './api/users.sa.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { User, UserSchema } from './domain/entities/nosql/users.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/application/session.service';
import { SessionRepository } from '../session/infrastructure/session.repository';
import { JwtGenerate } from '../auth/helper/generate.token';
import {
  Session,
  SessionSchema,
} from '../session/domain/entities/nosql/session.entity';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { Blog, BlogSchema } from '../blogs/domain/entities/nosql/blog.entity';
import { Post, PostSchema } from '../posts/domain/entities/nosql/posts.entity';
import {
  Comment,
  CommentSchema,
} from '../comments/domain/entities/nosql/comments.entity';
import {
  LikePost,
  LikePostSchema,
} from '../posts/domain/entities/nosql/likes.posts.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from '../comments/domain/entities/nosql/likes.comments.entity';
import { UsersBloggerController } from './api/users.blogger.controller';
import {
  BloggerUsersBan,
  BloggerUsersBanSchema,
} from './domain/entities/nosql/blogger.users.blogs.ban.entity';
import { BlogsQueryRepository } from '../blogs/infrastructure/blogs.query.repository';
import { BloggerExistsRule } from './guards/blogger-ban-validation.service';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from './application/use-cases/create.user.use.cases';
import {
  BanAdminUserCommand,
  BanAdminUserUseCase,
} from './application/use-cases/ban.admin.user.use.cases';
import {
  BanBloggerUserCommand,
  BanBloggerUserUseCase,
} from './application/use-cases/ban.blogger.user.use.cases';
import {
  DeleteUsersCommand,
  DeleteUsersUseCase,
} from './application/use-cases/delete.all.users.use.cases';
import {
  DeleteUserCommand,
  DeleteUserUseCase,
} from './application/use-cases/delete.user.use.cases';
import { UsersSqlRepository } from './infrastructure/users.sql.repository';
import { UsersSqlQueryRepository } from './infrastructure/users.sql.query.repository';
import { SessionSqlRepository } from '../session/infrastructure/session.sql.repository';
import { SessionSqlQueryRepository } from '../session/infrastructure/session.sql.query.repository';
import { BlogsSqlQueryRepository } from '../blogs/infrastructure/blogs.sql.query.repository';
import { BlogsSqlRepository } from '../blogs/infrastructure/blogs.sql.repository';
import { PostsSqlRepository } from '../posts/infrastructure/posts.sql.repository';
import { CommentsSqlRepository } from '../comments/infrastructure/comments.sql.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmation } from './domain/entities/sql/email.confirmation.entity';
import { Users } from './domain/entities/sql/user.entity';
import { PasswordConfirmation } from './domain/entities/sql/password.confirmation.entity';
import { UsersBanInfo } from './domain/entities/sql/users.ban.info.entity';
import { BloggersUsersBlogsBan } from './domain/entities/sql/bloggers.users.blogs.ban.entity';
import { UsersOrmRepository } from './infrastructure/users.orm.repository';
import { UsersOrmQueryRepository } from './infrastructure/users.orm.query.repository';
import { Blogs } from '../blogs/domain/entities/sql/blog.entity';
import { BlogsBanInfo } from '../blogs/domain/entities/sql/blogs.ban.info.entity';
import { Posts } from '../posts/domain/entities/sql/posts.entity';
import { LikePosts } from '../posts/domain/entities/sql/like.posts.entity';
import { LikeComments } from '../comments/domain/entities/sql/like.comments.entity';
import { Comments } from '../comments/domain/entities/sql/comments.entity';
import { Sessions } from '../session/domain/entities/sql/session.entity';
import { BlogsOrmRepository } from '../blogs/infrastructure/blogs.orm.repository';
import { BlogsOrmQueryRepository } from '../blogs/infrastructure/blogs.orm.query.repository';
import { CommentsOrmRepository } from '../comments/infrastructure/comments.orm.repository';
import { CommentsOrmQueryRepository } from '../comments/infrastructure/comments.orm.query.repository';
import { PostsOrmRepository } from '../posts/infrastructure/posts.orm.repository';
import { PostsOrmQueryRepository } from '../posts/infrastructure/posts.orm.query.repository';
import { SessionOrmQueryRepository } from '../session/infrastructure/session.orm.query.repository';
import { SessionOrmRepository } from '../session/infrastructure/session.orm.repository';

const userUseCase = [
  CreateUserUseCase,
  BanAdminUserUseCase,
  BanBloggerUserUseCase,
  DeleteUsersUseCase,
  DeleteUserUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: LikePost.name, schema: LikePostSchema },
      { name: LikeComment.name, schema: LikeCommentSchema },
      { name: BloggerUsersBan.name, schema: BloggerUsersBanSchema },
    ]),
    TypeOrmModule.forFeature([
      Users,
      EmailConfirmation,
      PasswordConfirmation,
      UsersBanInfo,
      BloggersUsersBlogsBan,
      Blogs,
      BlogsBanInfo,
      Posts,
      LikePosts,
      LikeComments,
      Comments,
      Sessions,
    ]),
    CqrsModule,
  ],
  controllers: [UsersSaController, UsersBloggerController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SessionService,
    SessionRepository,
    SessionSqlRepository,
    SessionSqlQueryRepository,
    JwtGenerate,
    BlogsRepository,
    BlogsSqlRepository,
    PostsRepository,
    PostsSqlRepository,
    CommentsRepository,
    BlogsQueryRepository,
    BlogsSqlQueryRepository,
    BloggerExistsRule,
    ...userUseCase,
    UsersSqlRepository,
    UsersSqlQueryRepository,
    CommentsSqlRepository,
    UsersOrmRepository,
    UsersOrmQueryRepository,
    BlogsOrmRepository,
    BlogsOrmQueryRepository,
    CommentsOrmRepository,
    CommentsOrmQueryRepository,
    PostsOrmRepository,
    PostsOrmQueryRepository,
    SessionOrmQueryRepository,
    SessionOrmRepository,
  ],
  exports: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersSqlQueryRepository,
    UsersSqlRepository,
    UsersOrmRepository,
    UsersOrmQueryRepository,
  ],
})
export class UsersModule {}
