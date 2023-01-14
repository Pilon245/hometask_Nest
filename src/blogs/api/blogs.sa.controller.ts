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
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { pagination } from '../../validation/query.validation';
import { BanBlogsInputModel, IdModelType } from '../domain/dto/blogsFactory';
import { BasicAdminGuard } from '../../auth/guards/basic-admin.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBlogOnNewUserCommand } from '../application/use-cases/update.blogs.on.new.user.use.cases';
import { CommandBus } from '@nestjs/cqrs';
import { BanBlogUseCaseDto } from '../domain/dto/update.blogs.dto';
import { BanBlogCommand } from '../application/use-cases/ban.blogs.use.cases';
import { BlogsSqlQueryRepository } from '../infrastructure/blogs.sql.query.repository';

@ApiTags('sa/blogs')
@Controller({
  path: 'sa/blogs',
  scope: Scope.DEFAULT,
})
export class BlogsSaController {
  constructor(
    protected blogsQueryRepository: BlogsSqlQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @Get()
  getBlogs(@Query() query) {
    return this.blogsQueryRepository.findBlogsOnSuperAdmin(pagination(query));
  }
  @UseGuards(BasicAdminGuard)
  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlogsBindWithUser(@Param() model: IdModelType) {
    const resultFound = await this.blogsQueryRepository.findBlogById(model.id);
    if (!resultFound || resultFound.blogOwnerInfo.userId) {
      throw new BadRequestException([
        { message: 'blogId Not Found', filed: 'blogId' },
      ]);
    }
    return this.commandBus.execute(new UpdateBlogOnNewUserCommand(model));
  }
  @UseGuards(BasicAdminGuard)
  @Put(':id/ban')
  @HttpCode(204)
  async updateBanBlogs(
    @Param('id') id: string,
    @Body() inputModel: BanBlogsInputModel,
  ) {
    const banBlogDto: BanBlogUseCaseDto = {
      id: id,
      isBanned: inputModel.isBanned,
    };
    return this.commandBus.execute(new BanBlogCommand(banBlogDto));
  }
}
