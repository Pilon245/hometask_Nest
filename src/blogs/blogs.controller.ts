import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import { CreatePostInputModelType } from '../posts/posts.controller';
import { Response } from 'express';
import { QueryDto } from '../helper/query';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';

//todo сделатьб иморт всех модулей
@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  getBlogs(@Query() query: QueryDto) {
    return this.blogsQueryRepository.findBlogs({ query });
  }
  @Get(':id')
  getBlog(@Param('id') blogId: string, @Res() res: Response) {
    const result = this.blogsQueryRepository.findBlogById(blogId);
    if (!result) return res.sendStatus(404);
    return;
  }
  @Get(':blogId/posts')
  getPostsOnBlogId(@Param('blogId') blogId: string, @Res() res: Response) {
    const result = this.postsQueryRepository.findPostByBlogId(blogId);
    if (!result) return res.sendStatus(404);
    return result;
  }
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputModelType) {
    return this.blogsService.createBlogs(inputModel);
  }
  @Post(':blogId/posts')
  CreatePostsOnBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostInputModelType,
    @Res() res: Response,
  ) {
    const newPost: CreatePostInputModelType = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
    const result = this.postsService.createPosts(newPost);
    if (!result) return res.sendStatus(404);
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputModelType,
    @Res() res: Response,
  ) {
    const result = this.blogsService.updateBlogs(blogId, model);
    if (!result) return res.sendStatus(404);
    return result;
  }
  @Delete(':id')
  @HttpCode(204)
  deleteBlogs(@Param('id') blogId: string, @Res() res: Response) {
    const result = this.blogsService.deleteBlogs(blogId);
    if (!result) return res.sendStatus(404);
    return result;
  }
}

export type CreateBlogInputModelType = {
  name: string;
  youtubeUrl: string;
};

export type BlogOutputModelType = {
  id: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
};

export type UpdateBlogInputModelType = {
  id: string;
  name: string;
  youtubeUrl: string;
};
