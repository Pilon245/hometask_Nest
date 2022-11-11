import {
  BadRequestException,
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
  Res,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import { CreatePostInputModelType } from '../posts/posts.controller';
import { Response } from 'express';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { isEmpty, isString, Length } from 'class-validator';
import { pagination } from '../middlewares/query.validation';

class CreateBlogInputModel {
  @Length(0, 100, { message: 'incorrect name' })
  name: string;
  @Length(0, 100)
  youtubeUrl: string;
}

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
  @Get(':blogId/posts')
  async getPostsOnBlogId(@Param('blogId') blogId: string, @Query() query) {
    const result = await this.postsQueryRepository.findPostByBlogId(
      blogId,
      pagination(query),
    );
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    console.log('result', result);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputModel) {
    return this.blogsService.createBlogs(inputModel);
  }
  @Post(':blogId/posts')
  async CreatePostsOnBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostInputModelType,
  ) {
    const newPost: CreatePostInputModelType = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
    const result = this.postsService.createPosts(newPost);
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputModelType,
  ) {
    const result = this.blogsService.updateBlogs(blogId, model);
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogs(@Param('id') blogId: string) {
    const result = this.blogsService.deleteBlogs(blogId);
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }
}

export class CreateBlogInputModelType {
  name: string;
  youtubeUrl: string;
}

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
