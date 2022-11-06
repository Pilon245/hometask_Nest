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
  getBlogs(@Query('term') term: string) {
    return this.blogsService;
  }
  @Get(':id')
  getBlog(@Param('id') blogId: string) {
    return;
  }
  // @Get(':id')
  // getBlog(@Param('id) blogId) {
  //   return;
  // }
  @Post()
  createBlogs(@Body() inputModel: CreateBlogInputModelType) {
    return;
  }
  @Put()
  updateBlogs(
    @Param('id') blogId: string,
    @Body() model: CreateBlogInputModelType,
  ) {
    return;
  }
  @Delete()
  deleteBlogs(@Param('id') blogId: string) {
    return;
  }
}

export type CreateBlogInputModelType = {
  name: string;
  youtubeUrl: string;
};
