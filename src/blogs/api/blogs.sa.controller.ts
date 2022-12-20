import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/posts.service';
import { BlogsQueryRepository } from '../blogs.query.repository';
import { PostsQueryRepository } from '../../posts/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { BanBlogsInputModel, IdModelType } from '../dto/blogsFactory';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { UsersQueryRepository } from '../../users/users.query.repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sa/blogs')
@Controller({
  path: 'sa/blogs',
  scope: Scope.DEFAULT,
})
export class BlogsSaController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  getBlogs(@Query() query) {
    return this.blogsQueryRepository.findBlogsOnSuperAdmin(pagination(query));
  }
  @UseGuards(BasicAdminGuard)
  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlogsBindWithUser(@Param() model: IdModelType) {
    return this.blogsService.updateBlogsOnNewUser(model);
  }
  @UseGuards(BasicAdminGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async updateBanBlogs(
    @Param('id') id: string,
    @Body() inputModel: BanBlogsInputModel,
  ) {
    return this.blogsService.banBlogs(id, inputModel.isBanned);
  }
}
