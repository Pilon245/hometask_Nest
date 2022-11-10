import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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

//todo versel  deploy

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
    // function pagination(query) {
    //   const page = typeof query.pageNumber === 'string' ? +query.pageNumber : 1;
    //
    //   return { page, pageSize, searchNameTerm, sortBy, sortDirection };
    // }
    //
    // const { page, pageSize, searchNameTerm, sortBy, sortDirection } =
    //   pagination(query);

    return this.blogsQueryRepository.findBlogs(pagination(query));
  }
  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    const result = await this.blogsQueryRepository.findBlogById(blogId); //todo async /await как убрать
    // if (!result)
    //   throw new BadRequestException(
    //     [{ message: 'blogId Not Found', filed: 'blogId' }],
    //     '404',
    //   );
    if (!result) throw new HttpException('invalid blog', 404); //todo почему тут не работает
    return result;
  }
  @Get(':blogId/posts')
  async getPostsOnBlogId(
    @Param('blogId') blogId: string,
    @Query() query,
    // @Res() res: Response,
  ) {
    const result = await this.postsQueryRepository.findPostByBlogId(
      blogId,
      pagination(query),
    );
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    console.log('result', resultFound);
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
    // @Res() res: Response,
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
    // @Res() res: Response,
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
  async deleteBlogs(
    @Param('id') blogId: string,
    // @Res() res: Response
  ) {
    const result = this.blogsService.deleteBlogs(blogId);
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
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
export const pagination = (query: any): QueryValidationResult => {
  let pageNumber = query.pageNumber;
  const parsedPageNumber = parseInt(pageNumber, 10);
  if (!pageNumber || !parsedPageNumber || parsedPageNumber <= 0)
    pageNumber = defaultPageNumber;
  pageNumber = parseInt(pageNumber, 10);

  let pageSize = query.pageSize;
  const parsedPageSize = parseInt(pageSize, 10);
  if (!pageSize || !parsedPageSize || parsedPageSize <= 0)
    pageSize = defaultPageSize;
  pageSize = parseInt(pageSize, 10);

  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
  const sortDirection =
    typeof query.sortDirection === 'string' ? query.sortDirection : 'desc';
  const searchNameTerm =
    typeof query.searchNameTerm === 'string'
      ? query.searchNameTerm?.toString()
      : '';
  const searchLoginTerm =
    typeof query.searchLoginTerm === 'string'
      ? query.searchLoginTerm?.toString()
      : '';
  const searchEmailTerm =
    typeof query.searchEmailTerm === 'string'
      ? query.searchEmailTerm?.toString()
      : '';
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
  };
};
type QueryValidationResult = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

const defaultPageSize = 10;
const defaultPageNumber = 1;

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}
