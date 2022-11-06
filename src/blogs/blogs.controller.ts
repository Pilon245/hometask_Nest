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

@Controller('blogs')
export class BlogsController {
  @Get()
  getBlogs(@Query('term') term: string) {
    return;
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
  updateBlogs() {
    return;
  }
  @Delete()
  deleteBlogs() {
    return;
  }
}

export type CreateBlogInputModelType = {
  name: string;
  youtubeUrl: string;
};
