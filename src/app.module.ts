import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/entities/blog.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';
import { Post, PostSchema } from './posts/entities/posts.entity';
import { RemoveController } from './remove.controller';
import { User, UserSchema } from './users/entities/users.entity';
import { Comment, CommentSchema } from './comments/entities/comments.entity';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsController } from './comments/comments.controller';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { CommentsQueryRepository } from './comments/comments.query.repository';
import { SessionModule } from './session/session.module';
import { LikePost, LikePostSchema } from './posts/entities/likes.posts.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from './comments/entities/likes.comments.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth/strategy/basic-strategy.service';
import { PasswordEmailAdapter } from './adapters/password-email-adapter.service';
import { EmailAdapter } from './adapters/emailAdapter';
import { Session, SessionSchema } from './session/entities/session.entity';
import { BearerAuthGuardOnGet } from './auth/strategy/bearer-auth-guard-on-get.service';
import { JwtGenerate } from './auth/helper/generate.token';
import { EmailManager } from './managers/email.manager';
import { BlogExistsRule } from './posts/guards/blog-id-validation.service';
import { CurrentUserId } from './auth/current-user.param.decorator';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { BlogsBloggerController } from './blogs/api/blogs.blogger.controller';

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: LikePost.name, schema: LikePostSchema },
  { name: LikeComment.name, schema: LikeCommentSchema },
  { name: Session.name, schema: SessionSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature(schemas),
    SessionModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    RemoveController,
    BlogsSaController,
    BlogsBloggerController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    CommentsService,
    CommentsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BasicStrategy,
    PasswordEmailAdapter,
    EmailAdapter,
    BearerAuthGuardOnGet,
    JwtGenerate,
    EmailManager,
    BlogExistsRule,
  ],
})
export class AppModule {}
