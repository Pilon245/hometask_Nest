import {
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Query,
  Req,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { BearerAuthGuardOnGet } from '../../auth/guards/bearer-auth-guard-on-get.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BlogsSqlQueryRepository } from '../infrastructure/blogs.sql.query.repository';

@ApiTags('blogs')
@Controller({
  path: 'blogs',
  scope: Scope.DEFAULT,
})
export class BlogsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  getBlogs(@Query() query) {
    console.log();
    return this.blogsQueryRepository.findBlogs(pagination(query));
  }
  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);
    if (!result)
      throw new NotFoundException(
        [{ message: 'blogId Not Found', filed: 'blogId' }],
        '404',
      );
    return result;
  }
  @UseGuards(BearerAuthGuardOnGet)
  @Get(':blogId/posts')
  async getPostsOnBlogId(
    @Param('blogId') blogId: string,
    @Query() query,
    @Req() req,
    @Res() res: Response,
  ) {
    const result = await this.blogsQueryRepository.findBlogById(blogId);
    if (!result) {
      throw new HttpException('invalid blog', 404);
    }
    const posts = await this.postsQueryRepository.findPostByBlogId(
      pagination(query),
      blogId,
      req.user?.id,
    );
    return res.status(200).send(posts);
  }
}
