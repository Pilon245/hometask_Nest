import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
  Request,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import {
  UpdateCommentInputModel,
  UpdateLikeInputModel,
} from './dto/update.comments.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { LikeValueComment } from './entities/likes.comments.entity';
import { OptionalBearerAuthGuard } from '../auth/strategy/optional.bearer.auth.guard';
import { Response } from 'express';
import { BearerAuthGuard } from '../auth/strategy/bearer.auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @UseGuards(BearerAuthGuard)
  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Query() query,
    @Req() req,
    @Res() res: Response,
  ) {
    console.log('req.user', req.user);

    if (!req.user) {
      const resultFound =
        await this.commentsQueryRepository.findCommentByIdNoAuth(id);
      if (!resultFound) {
        throw new HttpException('invalid blog', 404);
      }
      const comments = await this.commentsQueryRepository.findCommentByIdNoAuth(
        id,
      );
      console.log('comments', comments);
      return res.status(200).send(comments);
    }
    if (req.user) {
      const resultFound = await this.commentsQueryRepository.findCommentById(
        id,
        req.user.id,
      );
      if (!resultFound) {
        throw new HttpException('invalid blog', 404);
      }
      const comments = await this.commentsQueryRepository.findCommentById(
        id,
        req.user.id,
      );
      console.log('comments', comments);
      return res.status(200).send(comments);
    }
    console.log('req.user', req.user);
    return res.sendStatus(404);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateModel: UpdateCommentInputModel,
    @Request() req,
  ) {
    const found = await this.commentsQueryRepository.findCommentByIdAndLogin(
      req.user.id,
      commentId,
    );
    if (!found) {
      throw new HttpException('invalid blog', 403);
    }
    const isUpdate = await this.commentsService.updateComment(
      commentId,
      updateModel.content,
    );
    if (!isUpdate) {
      throw new HttpException('invalid blog', 404);
    }
    return isUpdate;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async updateLike(
    @Param('commentId') commentId: string,
    @Body() updateModel: UpdateLikeInputModel,
    @Request() req,
  ) {
    const resultFound =
      await this.commentsQueryRepository.findCommentByIdNoAuth(commentId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const like = updateModel.likeStatus;
    const isUpdate = await this.commentsService.updateLike(
      req.user.id,
      commentId,
      like as LikeValueComment,
    );
    console.log('isUpdate', isUpdate);
    return;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string, @Request() req) {
    const found = await this.commentsQueryRepository.findCommentByIdAndLogin(
      req.user.id,
      commentId,
    );
    if (!found) {
      throw new HttpException('invalid blog', 403);
    }
    const isDelete = await this.commentsService.deleteComment(
      req.params.commentId,
    );
    if (!isDelete) {
      throw new HttpException('invalid blog', 404);
    }
    return isDelete;
  }
}
