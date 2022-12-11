import { Module } from '@nestjs/common';
import { UsersSaController } from './api/users.sa.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { User, UserSchema } from './entities/users.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service';
import { SessionRepository } from '../session/session.repository';
import { JwtGenerate } from '../auth/helper/generate.token';
import { Session, SessionSchema } from '../session/entities/session.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { Blog, BlogSchema } from '../blogs/entities/blog.entity';
import { Post, PostSchema } from '../posts/entities/posts.entity';
import { Comment, CommentSchema } from '../comments/entities/comments.entity';
import { LikePost, LikePostSchema } from '../posts/entities/likes.posts.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from '../comments/entities/likes.comments.entity';
import { UsersBloggerController } from './api/users.blogger.controller';
import {
  BloggerUsersBan,
  BloggerUsersBanSchema,
} from './entities/blogger.users.blogs.ban.entity';

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
  ],
  controllers: [UsersSaController, UsersBloggerController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SessionService,
    SessionRepository,
    JwtGenerate,
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
