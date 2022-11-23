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
  UseGuards,
  Request,
} from '@nestjs/common';
import { extendedLikesInfoType, PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { pagination } from '../middlewares/query.validation';
import { LikeValuePost } from './entities/likes.posts.entity';
import { CreatePostInputDTO } from './dto/postsFactory';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UsersQueryRepository } from '../users/users.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  getPosts(@Query() query) {
    return this.postsQueryRepository.findPostsNoAuth(pagination(query));
  }
  @Get(':id')
  async getPost(@Param('id') id: string) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsQueryRepository.findPostByIdNoAuth(id);
  }
  @Get(':postId/comments')
  async getCommentOnPostId(@Param('postId') postId: string, @Query() query) {
    console.log('blogId', postId);
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.commentsQueryRepository.findCommentByPostIdNoAuth(
      postId,
      pagination(query),
    );
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPosts(@Body() inputModel: CreatePostInputDTO) {
    const resultFound = await this.blogsQueryRepository.findBlogById(
      inputModel.blogId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsService.createPosts(inputModel);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentOnPostId(
    @Param('postId') postId: string,
    @Query() query,
    @Body() inputmodel,
    @Request() req,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const user = await this.usersQueryRepository.findUsersForDTO(req.user.id);
    return this.commentsService.createComment(
      postId,
      inputmodel.content,
      user.id,
      user.accountData.login,
    );
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePosts(
    @Param('id') postId: string,
    @Body() model: CreatePostInputDTO,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsService.updatePosts(postId, model);
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePosts(@Param('id') postId: string) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const result = this.postsService.deletePosts(postId);
    return result;
  }
}

export type PostOutputModelType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo?: extendedLikesInfoType;
};

export type UpdatePostInputModelType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
