import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { UsersQueryRepository } from '../users.query.repository';
import { pagination } from '../../validation/query.validation';
import {
  BanBLoggerUsersInputModel,
  BanUserInputModel,
  CreateUserInputModel,
} from '../dto/usersFactory';
import { BasicAuthGuard } from '../../auth/strategy/basic-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategy/jwt-auth.guard';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { BlogsQueryRepository } from '../../blogs/blogs.query.repository';

@ApiTags('blogger/users')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'blogger/users',
  scope: Scope.DEFAULT,
})
export class UsersBloggerController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get('blog/:blogId')
  getUsers(
    @Query() query,
    @Param('blogId') blogId: string,
    @CurrentUserId() currentUserId,
  ) {
    return this.usersQueryRepository.findUsersOnBlogger(
      currentUserId,
      blogId,
      pagination(query),
    );
  }
  @Put(':id/ban')
  @HttpCode(204)
  async banBloggerUsers(
    @Param('id') id: string,
    @Body() inputModel: BanBLoggerUsersInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const user = await this.usersService.banBloggerUsers(
      id,
      currentUserId,
      inputModel,
    );
    if (!user) {
      throw new HttpException('invalid user', 404);
    }
    const resultFound = await this.blogsQueryRepository.findBlogBD(
      inputModel.blogId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return;
  }
}
