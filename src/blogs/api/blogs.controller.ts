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
import { BlogsService } from '../blogs.service';
import { PostsService } from '../../posts/posts.service';
import { Response } from 'express';
import { BlogsQueryRepository } from '../blogs.query.repository';
import { PostsQueryRepository } from '../../posts/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { BearerAuthGuardOnGet } from '../../auth/strategy/bearer-auth-guard-on-get.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('blogs')
@Controller({
  path: 'blogs',
  scope: Scope.DEFAULT,
})
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  getBlogs(@Query() query) {
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
    if (req.user) {
      const posts = await this.postsQueryRepository.findPostByBlogId(
        blogId,
        req.user.id,
        pagination(query),
      );
      return res.status(200).send(posts);
    }
    if (!req.user) {
      const posts = await this.postsQueryRepository.findPostByBlogIdNoAuth(
        blogId,
        pagination(query),
      );
      return res.status(200).send(posts);
    }
    return res.status(200).send(result);
  }
}
