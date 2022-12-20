import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
  Res,
  Scope,
  Put,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { pagination } from '../validation/query.validation';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UsersQueryRepository } from '../users/users.query.repository';
import { UpdateCommentInputModel } from '../comments/dto/update.comments.dto';
import { Response } from 'express';
import { BearerAuthGuardOnGet } from '../auth/strategy/bearer-auth-guard-on-get.service';
import { CurrentUserId } from '../auth/current-user.param.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePostLikeInputModel } from './dto/postsFactory';
import { LikeValuePost } from './entities/likes.posts.entity';

@ApiTags('posts')
@Controller({
  path: 'posts',
  scope: Scope.DEFAULT,
})
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @UseGuards(BearerAuthGuardOnGet)
  @Get()
  async getPosts(
    @Query() query,
    @Req() req,
    @Res() res: Response,
    @CurrentUserId() currentUserId,
  ) {
    if (currentUserId) {
      const posts = await this.postsQueryRepository.findPosts(
        currentUserId,
        pagination(query),
      );
      return res.status(200).send(posts);
    } else {
      const posts = await this.postsQueryRepository.findPostsNoAuth(
        pagination(query),
      );
      return res.status(200).send(posts);
    }
  }
  @UseGuards(BearerAuthGuardOnGet)
  @Get(':id')
  async getPost(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const foundBanBlogs = await this.blogsQueryRepository.findBlogBD(
      resultFound.blogId,
    );
    if (!foundBanBlogs) {
      throw new HttpException('invalid blog', 404);
    }
    if (req.user) {
      const post = await this.postsQueryRepository.findPostById(
        id,
        req.user.id,
      );
      return res.status(200).send(post);
    } else {
      const post = await this.postsQueryRepository.findPostByIdNoAuth(id);
      return res.status(200).send(post);
    }
  }
  @UseGuards(BearerAuthGuardOnGet)
  @Get(':postId/comments')
  async getCommentOnPostId(
    @Param('postId') postId: string,
    @Query() query,
    @Req() req,
    @Res() res: Response,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (req.user) {
      const comments = await this.commentsQueryRepository.findCommentByPostId(
        postId,
        req.user.id,
        pagination(query),
      );
      return res.status(200).send(comments);
    } else {
      const comments =
        await this.commentsQueryRepository.findCommentByPostIdNoAuth(
          postId,
          pagination(query),
        );
      return res.status(200).send(comments);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentOnPostId(
    @Param('postId') postId: string,
    @Query() query,
    @Body() inputModel: UpdateCommentInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const user = await this.usersQueryRepository.findUsersForDTO(currentUserId);
    const comment = await this.commentsService.createComment(
      postId,
      inputModel.content,
      user.id,
      user.accountData.login,
    );
    if (!comment) {
      throw new HttpException('Ban', 403);
    }
    return this.commentsQueryRepository.findCommentByIdNoAuth(comment.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updateLike(
    @Param('postId') postId: string,
    @Body() updateModel: UpdatePostLikeInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const like = updateModel.likeStatus;
    const user = await this.usersQueryRepository.findUsersById(currentUserId);
    if (!user) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsService.updateLike(
      user.id,
      postId,
      like as LikeValuePost,
      user.login,
    );
  }
}
