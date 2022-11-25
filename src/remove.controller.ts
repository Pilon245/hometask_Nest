import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PostsService } from './posts/posts.service';
import { UsersService } from './users/users.service';
import { CommentsService } from './comments/comments.service';
import { SessionService } from './session/session.service';
import { BlogsService } from './blogs/blogs.service';

@Controller('testing/all-data')
export class RemoveController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected usersService: UsersService,
    protected commentsService: CommentsService,
    protected sessionService: SessionService,
  ) {}
  @Delete()
  @HttpCode(204)
  deleteAllData() {
    this.blogsService.deleteAllBlogs();
    this.postsService.deleteAllPost();
    this.usersService.deleteAllUsers();
    this.commentsService.deleteAllComment();
    this.sessionService.deleteAllSessions();
    return;
  }
}
