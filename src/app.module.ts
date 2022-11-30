import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blog.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';
import { Post, PostSchema } from './posts/entities/posts.entity';
import { RemoveController } from './remove.controller';
import { User, UserSchema } from './users/users.entity';
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
import { OptionalBearerAuthGuard } from './auth/strategy/optional.bearer.auth.guard';
import { JwtGenerate } from './auth/helper/generate.token';
import { AuthGuard } from './auth/strategy/forbiten.giard';
import { EmailManager } from './managers/email.manager';
import { BlogExistsRule } from './posts/guards/blog-id-validation.service';

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
    // UsersController,
    CommentsController,
    RemoveController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    // UsersService,
    // UsersRepository,
    CommentsService,
    CommentsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    // UsersQueryRepository,
    CommentsQueryRepository,
    // LocalStrategy,
    BasicStrategy,
    PasswordEmailAdapter,
    EmailAdapter,
    BearerAuthGuardOnGet,
    OptionalBearerAuthGuard,
    JwtGenerate,
    AuthGuard,
    EmailManager,
    BlogExistsRule,
  ],
})
export class AppModule {}
