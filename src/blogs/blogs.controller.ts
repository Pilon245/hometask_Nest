import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
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
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputModelType) {
    return this.blogsService.createBlogs(inputModel);
  }
  @Put(':id')
  updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputModelType,
  ) {
    return this.blogsService.updateBlogs(blogId, model);
  }
  @Delete(':id')
  deleteBlogs(@Param('id') blogId: string) {
    return this.blogsService.deleteBlogs(blogId);
  }
}

export type CreateBlogInputModelType = {
  name: string;
  youtubeUrl: string;
};

export type BlogInputModelType = {
  id: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
};

export type UpdateBlogInputModelType = {
  id: string;
  name?: string;
  youtubeUrl?: string;
};
