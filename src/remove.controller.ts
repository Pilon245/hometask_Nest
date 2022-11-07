import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PostsService } from './posts/posts.service';
import { BlogsService } from './blogs/blogs.service';
import { UsersService } from './users/users.service';

@Controller('testing/all-data')
export class RemoveController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected usersService: UsersService,
  ) {}
  @Delete()
  @HttpCode(204)
  deleteAllData() {
    this.blogsService.deleteAllBlogs();
    this.postsService.deleteAllPosts();
    this.usersService.deleteAllUsers();
    return;
  }
}
