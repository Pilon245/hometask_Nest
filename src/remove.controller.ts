import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PostsService } from './posts/posts.service';
import { BlogsService } from './blogs/blogs.service';
import { UsersService } from './users/users.service';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { UsersQueryRepository } from './users/users.query.repository';

@Controller('testing/all-data')
export class RemoveController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Delete()
  @HttpCode(204)
  deleteAllData() {
    this.blogsQueryRepository.deleteAllBlogs();
    this.postsQueryRepository.deleteAllPosts();
    this.usersQueryRepository.deleteAllUsers();
    return;
  }
}
