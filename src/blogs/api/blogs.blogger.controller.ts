import {
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
  Scope,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/posts.service';
import { BlogsQueryRepository } from '../blogs.query.repository';
import { PostsQueryRepository } from '../../posts/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { CreateBlogInputDTO } from '../dto/blogsFactory';
import { CreatePostByBlogIdInputDTO } from '../../posts/dto/postsFactory';
import {
  UpdateBlogInputModelType,
  UpdateBlogUseCaseDto,
} from '../dto/update.blogs.dto';
import { JwtAuthGuard } from '../../auth/strategy/jwt-auth.guard';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { UpdatePostBloggerInputModelType } from '../../posts/dto/update.posts.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../../comments/comments.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogsUseCaseDto } from '../dto/createBlogsDto';
import { CreateBlogsCommand } from '../application/use-cases/create.blogs.use.cases';
import { UpdateBlogCommand } from '../application/use-cases/update.blogs.use.cases';

@ApiTags('blogger/blogs')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'blogger/blogs',
  scope: Scope.DEFAULT,
})
export class BlogsBloggerController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  getBlogs(@Query() query, @CurrentUserId() currentUserId) {
    return this.blogsQueryRepository.findBlogsOnBlogger(
      currentUserId,
      pagination(query),
    );
  }
  @Get('comments')
  async getComments(@Query() query, @CurrentUserId() currentUserId) {
    const blog = await this.blogsQueryRepository.findBlogByUserId(
      currentUserId,
    );
    if (!blog) {
      throw new HttpException('invalid blog', 404);
    }
    return this.commentsQueryRepository.findCommentByBlogger(
      currentUserId,
      pagination(query),
    );
  }
  @Post()
  async createBlogs(
    @Body() inputModel: CreateBlogInputDTO,
    @CurrentUserId() currentUserId,
  ) {
    const createUseCaseDto: CreateBlogsUseCaseDto = {
      userId: currentUserId,
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    };
    const newBlog = await this.commandBus.execute(
      new CreateBlogsCommand(createUseCaseDto),
    );
    return this.blogsQueryRepository.findBlogByIdOnBlogger(newBlog.id);
  }
  @Post(':blogId/posts')
  async CreatePostsOnBlogId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostByBlogIdInputDTO,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogBD(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const newPost: CreatePostByBlogIdInputDTO = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
    const posts = await this.postsService.createPosts(newPost, currentUserId);
    return this.postsQueryRepository.findPostByIdNoAuth(posts.id);
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogs(
    @Param('id') blogId: string,
    @Body() model: UpdateBlogInputModelType,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogBD(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const updateDto: UpdateBlogUseCaseDto = {
      id: blogId,
      name: model.name,
      description: model.description,
      websiteUrl: model.websiteUrl,
    };
    return this.commandBus.execute(new UpdateBlogCommand(updateDto));
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogs(
    @Param('id') blogId: string,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogBD(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return this.blogsService.deleteBlogs(blogId);
  }
  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePosts(
    @Param() { postId, blogId },
    @Body() model: UpdatePostBloggerInputModelType,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('Invalid id', 404);
    }
    const blog = await this.blogsQueryRepository.findBlogBD(blogId);
    if (!blog) {
      throw new HttpException('Invalid id', 404);
    }
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return this.postsService.updatePosts(postId, blogId, model);
  }
  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePosts(
    @Param() { blogId, postId },
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const blog = await this.blogsQueryRepository.findBlogBD(blogId);
    if (!blog) {
      throw new HttpException('Invalid id', 404);
    }
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return this.postsService.deletePosts(postId);
  }
}
