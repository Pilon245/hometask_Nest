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
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { extendedLikesInfoType, PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { pagination } from '../middlewares/query.validation';
import { LikeValuePost } from './entities/likes.posts.entity';
import {
  CreatePostInputDTO,
  UpdatePostLikeInputModel,
} from './dto/postsFactory';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UsersQueryRepository } from '../users/users.query.repository';
import {
  UpdateCommentInputModel,
  UpdateCommentLikeInputModel,
} from '../comments/dto/update.comments.dto';
import { LikeValueComment } from '../comments/entities/likes.comments.entity';
import { Response } from 'express';
import { BearerAuthGuardOnGet } from '../auth/strategy/bearer-auth-guard-on-get.service';

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
  @UseGuards(BearerAuthGuardOnGet)
  @Get()
  async getPosts(@Query() query, @Req() req, @Res() res: Response) {
    if (req.user) {
      const posts = await this.postsQueryRepository.findPosts(
        req.user.id,
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
    if (req.user) {
      const posts = await this.postsQueryRepository.findPostById(
        id,
        req.user.id,
      );
      return res.status(200).send(posts);
    } else {
      const posts = await this.postsQueryRepository.findPostByIdNoAuth(id);
      return res.status(200).send(posts);
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
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPosts(@Body() inputModel: CreatePostInputDTO) {
    const resultFound = await this.blogsQueryRepository.findBlogById(
      inputModel.blogId,
    );
    if (!resultFound) {
      throw new BadRequestException([
        { message: 'Incorecct blogId', field: 'blogId' },
      ]);
    }
    return this.postsService.createPosts(inputModel);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentOnPostId(
    @Param('postId') postId: string,
    @Query() query,
    @Body() inputmodel: UpdateCommentInputModel,
    @Request() req,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const user = await this.usersQueryRepository.findUsersForDTO(req.user.id);
    const comment = await this.commentsService.createComment(
      postId,
      inputmodel.content,
      user.id,
      user.accountData.login,
    );
    return this.commentsQueryRepository.findCommentByIdNoAuth(comment.id);
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
      throw new BadRequestException([
        { message: 'blogId Not Found', filed: 'blogId' },
      ]);
    }
    return this.postsService.updatePosts(postId, model);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updateLike(
    @Param('postId') postId: string,
    @Body() updateModel: UpdatePostLikeInputModel,
    @Request() req,
  ) {
    const resultFound = await this.postsQueryRepository.findPostByIdNoAuth(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const like = updateModel.likeStatus;
    // if (like !== typeof LikeValuePost) {
    //   throw new BadRequestException([
    //     { message: 'LikesStatus invalid', field: 'likeStatus' },
    //   ]);
    // }
    const user = await this.usersQueryRepository.findUsersById(req.user.id);
    if (!user) {
      throw new HttpException('invalid blog', 404);
    }
    const isUpdate = await this.postsService.updateLike(
      user.id,
      postId,
      like as LikeValuePost,
      user.login,
    );
    console.log('isUpdate', isUpdate);
    return;
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
