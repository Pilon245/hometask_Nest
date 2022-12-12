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
import { CreateBlogInputDTO, IdModelType } from '../dto/blogsFactory';
import { CreatePostByBlogIdInputDTO } from '../../posts/dto/postsFactory';
import { BasicAuthGuard } from '../../auth/strategy/basic-auth.guard';
import { UpdateBlogInputModelType } from '../dto/update.blogs.dto';
import { BearerAuthGuardOnGet } from '../../auth/strategy/bearer-auth-guard-on-get.service';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { UpdatePostInputModelType } from '../../posts/dto/update.posts.dto';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { UsersQueryRepository } from '../../users/users.query.repository';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(BasicAdminGuard)
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
  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlogsBindWithUser(
    @Param() model: IdModelType,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(model.id);
    if (!resultFound || resultFound.blogOwnerInfo.userId) {
      throw new BadRequestException([
        { message: 'blogId Not Found', filed: 'blogId' },
      ]);
    }

    const user = await this.usersQueryRepository.findUsersById(model.userId);
    if (!user) {
      throw new BadRequestException([
        { message: 'userId Not Found', filed: 'userId' },
      ]);
    }
    return this.blogsService.updatePostsOnNewUser(user.login, model);
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
  @Put(':id/ban')
  @HttpCode(204)
  async updateBanBlogs(
    @Param('id') id: string,
    @Body() inputModel: BanBlogsInputModel,
  ) {
    const blog = await this.blogsService.banBlogs(id, inputModel.isBanned);
    // if (blog) return;
    return;
  }
>>>>>>> parent of 4804d2d (Nest 16.01 ban)
=======
>>>>>>> origin/main
}
