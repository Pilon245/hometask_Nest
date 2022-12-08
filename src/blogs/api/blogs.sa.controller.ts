import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { CreateBlogInputDTO } from '../dto/blogsFactory';
import { CreatePostByBlogIdInputDTO } from '../../posts/dto/postsFactory';
import { BasicAuthGuard } from '../../auth/strategy/basic-auth.guard';
import { UpdateBlogInputModelType } from '../dto/update.blogs.dto';
import { BearerAuthGuardOnGet } from '../../auth/strategy/bearer-auth-guard-on-get.service';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';

@UseGuards(BasicAdminGuard)
@Controller({
  path: 'sa/blogs',
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
    return this.blogsQueryRepository.findBlogsOnSuperAdmin(pagination(query));
  }
}
