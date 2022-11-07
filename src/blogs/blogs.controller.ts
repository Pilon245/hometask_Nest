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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import { CreatePostInputModelType } from '../posts/posts.controller';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}
  @Get()
  getBlogs(
    @Query()
    query: // 'searchNameTerm',
    // 'pageNumber',
    // 'pageSize',
    // 'sortBy',
    // 'sortDirection',
    {
      searchNameTerm: string;
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    return this.blogsService.findBlogs();
  }
  @Get(':id')
  getBlog(@Param('id') blogId: string) {
    return this.blogsService.findBlogById(blogId);
  }
  @Get(':blogId/posts')
  getPostsOnBlogId(@Param('blogId') blogId: string) {
    return this.postsService.findPostByBlogId(blogId);
  }
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputModelType) {
    return this.blogsService.createBlogs(inputModel);
  }
  @Post(':blogId/posts')
  CreatePostsOnBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostInputModelType,
  ) {
    const newPost: CreatePostInputModelType = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
    return this.postsService.createPosts(newPost);
  }

  @Put(':id')
  @HttpCode(204)
  updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputModelType,
  ) {
    return this.blogsService.updateBlogs(blogId, model);
  }
  @Delete(':id')
  @HttpCode(204)
  deleteBlogs(@Param('id') blogId: string) {
    const result = this.blogsService.deleteBlogs(blogId);
    return result;
    // if(!result)  return @HttpCode(404)
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
