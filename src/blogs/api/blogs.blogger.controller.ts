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
import { BlogsService } from '../blogs.service';
import { PostsService } from '../../posts/posts.service';
import { BlogsQueryRepository } from '../blogs.query.repository';
import { PostsQueryRepository } from '../../posts/posts.query.repository';
import { pagination } from '../../validation/query.validation';
import { CreateBlogInputDTO } from '../dto/blogsFactory';
import { CreatePostByBlogIdInputDTO } from '../../posts/dto/postsFactory';
import { UpdateBlogInputModelType } from '../dto/update.blogs.dto';
import { JwtAuthGuard } from '../../auth/strategy/jwt-auth.guard';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { UpdatePostBloggerInputModelType } from '../../posts/dto/update.posts.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../../comments/comments.query.repository';

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
  ) {}

  @Get()
  getBlogs(@Query() query, @CurrentUserId() currentUserId) {
    return this.blogsQueryRepository.findBlogsOnBlogger(
      currentUserId,
      pagination(query),
    );
  }
  @Get('comments')
  getComments(@Query() query, @CurrentUserId() currentUserId) {
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
    const newBlog = await this.blogsService.createBlogs(
      currentUserId,
      inputModel,
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
    const result = await this.postsQueryRepository.findPostByIdNoAuth(posts.id);
    return result;
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
    return this.blogsService.updateBlogs(blogId, model);
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
