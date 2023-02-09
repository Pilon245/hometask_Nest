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
import {
  BlogsQueryRepository,
  FindBlogsPayload,
} from '../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { BlogsFactory, CreateBlogInputDTO } from '../domain/dto/blogsFactory';
import {
  CreatePostByBlogIdInputDTO,
  CreatePostUseCaseDto,
} from '../../posts/domain/dto/postsFactory';
import {
  UpdateBlogInputModelType,
  UpdateBlogUseCaseDto,
} from '../domain/dto/update.blogs.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import {
  UpdatePostBloggerInputModelType,
  UpdatePostUseCaseDTO,
} from '../../posts/domain/dto/update.posts.dto';
import {
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogsUseCaseDto } from '../domain/dto/createBlogsDto';
import { CreateBlogsCommand } from '../application/use-cases/create.blogs.use.cases';
import { UpdateBlogCommand } from '../application/use-cases/update.blogs.use.cases';
import { DeleteBlogCommand } from '../application/use-cases/delete.blogs.use.cases';
import { CreatePostCommand } from '../../posts/application/use-cases/create.post.use.cases';
import { UpdatePostCommand } from '../../posts/application/use-cases/update.post.use.cases';
import { DeletePostCommand } from '../../posts/application/use-cases/delete.post.use.cases';
import { Blog, BlogSchema } from '../domain/entities/nosql/blog.entity';
import { BlogsSqlQueryRepository } from '../infrastructure/blogs.sql.query.repository';
import { PostsSqlQueryRepository } from '../../posts/infrastructure/posts.sql.query.repository';
import { CommentsSqlQueryRepository } from '../../comments/infrastructure/comments.sql.query.repository';

@ApiTags('blogger/blogs')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'blogger/blogs',
  scope: Scope.DEFAULT,
})
export class BlogsBloggerController {
  constructor(
    protected postsQueryRepository: PostsSqlQueryRepository,
    protected blogsQueryRepository: BlogsSqlQueryRepository,
    protected commentsQueryRepository: CommentsSqlQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @ApiOkResponse({
    description: 'The blog records',
    type: BlogsFactory,
    isArray: true,
  })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  @ApiQuery({ name: 'sortBy' })
  @ApiQuery({ name: 'sortDirection' })
  @ApiQuery({ name: 'searchNameTerm' })
  @ApiResponse({ status: 200, description: 'Find is successes' })
  @Get()
  getBlogs(@Query() query, @CurrentUserId() currentUserId) {
    return this.blogsQueryRepository.findBlogsOnBlogger(
      currentUserId,
      pagination(query),
    );
  }
  @ApiResponse({ status: 200, description: 'Find is successes' })
  @ApiResponse({ status: 404, description: 'Not Found' })
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
  @ApiResponse({ status: 201, description: 'Created is successes' })
  @ApiResponse({ status: 404, description: 'Not Found' })
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
  @ApiResponse({ status: 201, description: 'Created is successes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
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
    const newPost: CreatePostUseCaseDto = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
      userId: currentUserId,
    };
    const posts = await this.commandBus.execute(new CreatePostCommand(newPost));
    return this.postsQueryRepository.findPostById(posts.id);
  }
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
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
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
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
    return this.commandBus.execute(new DeleteBlogCommand(blogId));
  }
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePosts(
    @Param() { postId, blogId },
    @Body() model: UpdatePostBloggerInputModelType,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostById(postId);
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
    const updatePost: UpdatePostUseCaseDTO = {
      postId: postId,
      title: model.title,
      shortDescription: model.shortDescription,
      content: model.content,
      blogId: blogId,
    };
    return this.commandBus.execute(new UpdatePostCommand(updatePost));
  }
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePosts(
    @Param() { blogId, postId },
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostById(postId);
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
    return this.commandBus.execute(new DeletePostCommand(postId));
  }
}
