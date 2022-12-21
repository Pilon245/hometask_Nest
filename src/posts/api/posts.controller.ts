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
import { PostsService } from '../application/posts.service';
import { CommentsService } from '../../comments/application/comments.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { pagination } from '../../validation/query.validation';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { UpdateCommentInputModel } from '../../comments/domain/dto/update.comments.dto';
import { Response } from 'express';
import { BearerAuthGuardOnGet } from '../../auth/guards/bearer-auth-guard-on-get.service';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePostLikeInputModel } from '../domain/dto/postsFactory';
import { LikeValuePost } from '../domain/entities/likes.posts.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateLikePostCommand } from '../application/use-cases/update.like.post.use.cases';
import { UpdateLikePostUseCaseDTO } from '../domain/dto/update.posts.dto';
import { CreateCommentUseCaseDto } from '../../comments/domain/dto/commentsFactory';
import { CreateCommentCommand } from '../../comments/application/use-cases/create.comment.use.cases';

@ApiTags('posts')
@Controller({
  path: 'posts',
  scope: Scope.DEFAULT,
})
export class PostsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
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
    const newComment: CreateCommentUseCaseDto = {
      content: inputModel.content,
      userId: user.id,
      postId: postId,
      userLogin: user.accountData.login,
    };
    const comment = await this.commandBus.execute(
      new CreateCommentCommand(newComment),
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
    const likePost: UpdateLikePostUseCaseDTO = {
      userId: user.id,
      postId: postId,
      value: like as LikeValuePost,
      login: user.login,
    };
    return this.commandBus.execute(new UpdateLikePostCommand(likePost));
  }
}
