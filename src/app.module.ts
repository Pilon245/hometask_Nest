import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { Post, PostSchema } from './posts/domain/entities/nosql/posts.entity';
import { RemoveController } from './remove.controller';
import { User, UserSchema } from './users/domain/entities/nosql/users.entity';
import {
  Comment,
  CommentSchema,
} from './comments/domain/entities/nosql/comments.entity';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts.query.repository';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query.repository';
import { SessionModule } from './session/session.module';
import {
  LikePost,
  LikePostSchema,
} from './posts/domain/entities/nosql/likes.posts.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from './comments/domain/entities/nosql/likes.comments.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth/strategy/basic-strategy.service';
import { PasswordEmailAdapter } from './adapters/password-email-adapter.service';
import { EmailAdapter } from './adapters/emailAdapter';
import {
  Session,
  SessionSchema,
} from './session/domain/entities/nosql/session.entity';
import { BearerAuthGuardOnGet } from './auth/guards/bearer-auth-guard-on-get.service';
import { JwtGenerate } from './auth/helper/generate.token';
import { EmailManager } from './managers/email.manager';
import { BlogExistsRule } from './posts/guards/blog-id-validation.service';
import { CurrentUserId } from './auth/current-user.param.decorator';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { BlogsBloggerController } from './blogs/api/blogs.blogger.controller';
import {
  BloggerUsersBan,
  BloggerUsersBanSchema,
} from './users/domain/entities/nosql/blogger.users.blogs.ban.entity';
import { BloggerExistsRule } from './users/guards/blogger-ban-validation.service';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from './users/application/use-cases/create.user.use.cases';
import { BanBlogUseCase } from './blogs/application/use-cases/ban.blogs.use.cases';
import { CreateBlogsUseCase } from './blogs/application/use-cases/create.blogs.use.cases';
import {
  DeleteBlogsCommand,
  DeleteBlogsUseCase,
} from './blogs/application/use-cases/delete.all.blogs.use.cases';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete.blogs.use.cases';
import { UpdateBlogOnNewUserUseCase } from './blogs/application/use-cases/update.blogs.on.new.user.use.cases';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update.blogs.use.cases';
import { CreatePostsUseCase } from './posts/application/use-cases/create.post.use.cases';
import { DeletePostsUseCase } from './posts/application/use-cases/delete.all.posts.use.cases';
import { DeletePostUseCase } from './posts/application/use-cases/delete.post.use.cases';
import { UpdateLikePostUseCase } from './posts/application/use-cases/update.like.post.use.cases';
import { UpdatePostUseCase } from './posts/application/use-cases/update.post.use.cases';
import { CreateSessionUseCase } from './session/application/use-cases/create.session.use.cases';
import { DeleteSessionUseCase } from './session/application/use-cases/delete.all.session.use.cases';
import { DeleteDeviceByDeviceIdUseCase } from './session/application/use-cases/delete.device.id.session.use.cases';
import { DeleteDevicesUseCase } from './session/application/use-cases/delete.devices.session.use.cases';
import { UpdateSessionUseCase } from './session/application/use-cases/update.session.use.cases';
import { CreateCommentUseCase } from './comments/application/use-cases/create.comment.use.cases';
import { DeleteCommentsUseCase } from './comments/application/use-cases/delete.all.comment.use.cases';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete.comment.use.cases';
import { UpdateCommentUseCase } from './comments/application/use-cases/update.comment.use.cases';
import { UpdateLikeCommentUseCase } from './comments/application/use-cases/update.like.comment.use.cases';
import { DeleteUsersUseCase } from './users/application/use-cases/delete.all.users.use.cases';
import { UserExistsRule } from './blogs/guards/blog-id-validation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsSqlQueryRepository } from './blogs/infrastructure/blogs.sql.query.repository';
import { UsersSqlRepository } from './users/infrastructure/users.sql.repository';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';
import { BlogsSqlRepository } from './blogs/infrastructure/blogs.sql.repository';
import { PostsSqlQueryRepository } from './posts/infrastructure/posts.sql.query.repository';
import { PostsSqlRepository } from './posts/infrastructure/posts.sql.repository';
import { CommentsSqlQueryRepository } from './comments/infrastructure/comments.sql.query.repository';
import { CommentsSqlRepository } from './comments/infrastructure/comments.sql.repository';
// import { AvatarsModule } from './avatars/avatars.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Blog, BlogSchema } from './blogs/domain/entities/nosql/blog.entity';
import { Blogs } from './blogs/domain/entities/sql/blog.entity';
import { BlogsBanInfo } from './blogs/domain/entities/sql/blogs.ban.info.entity';
import { Posts } from './posts/domain/entities/sql/posts.entity';
import { LikePosts } from './posts/domain/entities/sql/like.posts.entity';
import { LikeComments } from './comments/domain/entities/sql/like.comments.entity';
import { Comments } from './comments/domain/entities/sql/comments.entity';

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: LikePost.name, schema: LikePostSchema },
  { name: LikeComment.name, schema: LikeCommentSchema },
  { name: Session.name, schema: SessionSchema },
  { name: BloggerUsersBan.name, schema: BloggerUsersBanSchema },
];

const sqlSchemas = [
  Blogs,
  BlogsBanInfo,
  Posts,
  LikePosts,
  LikeComments,
  Comments,
];

const adapters = [];
const guards = [];
const useCases = [CreateUserUseCase];
const blogsUseCase = [
  BanBlogUseCase,
  CreateBlogsUseCase,
  DeleteBlogsUseCase,
  DeleteBlogUseCase,
  UpdateBlogOnNewUserUseCase,
  UpdateBlogUseCase,
];
const postsUseCase = [
  CreatePostsUseCase,
  DeletePostsUseCase,
  DeletePostUseCase,
  UpdateLikePostUseCase,
  UpdatePostUseCase,
];
const sessionUseCase = [
  CreateSessionUseCase,
  DeleteSessionUseCase,
  DeleteDeviceByDeviceIdUseCase,
  DeleteDevicesUseCase,
  UpdateSessionUseCase,
];
const commentsUserCase = [
  CreateCommentUseCase,
  DeleteCommentsUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateLikeCommentUseCase,
];

const deleteAll = [
  DeleteBlogsUseCase,
  DeletePostsUseCase,
  DeleteUsersUseCase,
  DeleteSessionUseCase,
  DeleteCommentsUseCase,
];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: 5432,
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DATABASE'),
        ssl: true,
        // autoLoadEntities: true, // автоматически делает изменения
        // synchronize: true, // true  во время разработки
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '1234',
    //   database: 'network',
    //   // ssl: true,
    //   autoLoadEntities: true, // автоматически делает изменения
    //   synchronize: true, // true  во время разработки
    //   // entities: sqlSchemas,
    // }),
    MongooseModule.forFeature(schemas),
    // TypeOrmModule.forFeature(sqlSchemas),
    SessionModule,
    UsersModule,
    AuthModule,
    CqrsModule,
    // AvatarsModule,
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
    BloggerExistsRule,
    BlogsQueryRepository,
    ...useCases,
    CreateUserCommand,
    ...blogsUseCase,
    ...postsUseCase,
    ...sessionUseCase,
    ...commentsUserCase,
    ...deleteAll,
    UserExistsRule,
    BlogsSqlQueryRepository,
    UsersSqlRepository,
    UsersSqlQueryRepository,
    BlogsSqlRepository,
    PostsSqlQueryRepository,
    PostsSqlRepository,
    CommentsSqlQueryRepository,
    CommentsSqlRepository,
  ],
})
export class AppModule {}
