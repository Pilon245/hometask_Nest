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
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { User, UserSchema } from './users/users.entity';
import { Comment, CommentSchema } from './comments/entities/comments.entity';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsController } from './comments/comments.controller';
import { UsersController } from './users/users.controller';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { UsersQueryRepository } from './users/users.query.repository';
import { CommentsQueryRepository } from './comments/comments.query.repository';
import { LikesModule } from './likes/likes.module';
import { SessionModule } from './session/session.module';
import { LikePost, LikePostSchema } from './posts/entities/likes.posts.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from './comments/entities/likes.comments.entity';
import { UsersModule } from './users/users.module';

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: LikePost.name, schema: LikePostSchema },
  { name: LikeComment.name, schema: LikeCommentSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(schemas),
    LikesModule,
    SessionModule,
    UsersModule,
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
  ],
})
export class AppModule {}
