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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import { Response } from 'express';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { isEmpty, isString, IsUrl, Length } from 'class-validator';
import { pagination } from '../middlewares/query.validation';
import { BlogsFactory, CreateBlogInputDTO } from './dto/blogsFactory';
import {
  CreatePostByBlogIdInputDTO,
  CreatePostInputDTO,
} from '../posts/dto/postsFactory';
import { LocalAuthGuard } from '../auth/strategy/local-auth.guard';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { BasicStrategy } from '../auth/strategy/basic-strategy.service';
import { LocalStrategy } from '../auth/strategy/local.strategy';

// export class CreateBlogInputDTO {
//   @Length(0, 100, { message: 'incorrect name' })
//   name: string;
//   @Length(0, 100)
//   @IsUrl()
//   youtubeUrl: string;
// }

export class CreateBlogInputModelType {
  constructor(public name: string, public youtubeUrl: string) {}
}
export class CreateBlogInputModelType2 {
  public name: string;
  public youtubeUrl: string;
  constructor(name: string, youtubeUrl: string) {
    this.name = name;
    this.youtubeUrl = youtubeUrl;
  }
}
const someBlog = new CreateBlogInputModelType2('Vasya', 'url');

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
    const result = await this.postsQueryRepository.findPostByBlogIdNoAuth(
      blogId,
      pagination(query),
    );
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return result;
  }

  @UseGuards(BasicAuthGuard)
  // @UseGuards(AuthGuard('basic'), AuthGuard('local'))
  // @UseGuards(AuthGuard('local'))
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputDTO) {
    return this.blogsService.createBlogs(inputModel);
  }
  @Post(':blogId/posts')
  async CreatePostsOnBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostByBlogIdInputDTO,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const newPost: CreatePostByBlogIdInputDTO = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
    const result = this.postsService.createPosts(newPost);
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputDTO,
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

export type UpdateBlogInputModelType = {
  id: string;
  name: string;
  youtubeUrl: string;
};
