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
  Delete,
  Scope,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import {
  UpdateCommentInputModel,
  UpdateCommentLikeInputModel,
} from './dto/update.comments.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { LikeValueComment } from './entities/likes.comments.entity';
import { BearerAuthGuardOnGet } from '../auth/strategy/bearer-auth-guard-on-get.service';
import { CurrentUserId } from '../auth/current-user.param.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller({
  path: 'comments',
  scope: Scope.DEFAULT,
})
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @UseGuards(BearerAuthGuardOnGet)
  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @Query() query,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound =
      await this.commentsQueryRepository.findCommentByIdNoAuth(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (currentUserId) {
      return this.commentsQueryRepository.findCommentById(id, currentUserId);
    }
    return resultFound;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateModel: UpdateCommentInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const isUpdate = await this.commentsService.updateComment(
      commentId,
      updateModel.content,
    );
    if (!isUpdate) {
      throw new HttpException('invalid blog', 404);
    }
    const found = await this.commentsQueryRepository.findCommentByIdAndLogin(
      currentUserId,
      commentId,
    );
    if (!found) {
      throw new HttpException('invalid blog', 403);
    }

    return isUpdate;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async updateLike(
    @Param('commentId') commentId: string,
    @Body() updateModel: UpdateCommentLikeInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound =
      await this.commentsQueryRepository.findCommentByIdNoAuth(commentId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const like = updateModel.likeStatus;
    return this.commentsService.updateLike(
      currentUserId,
      commentId,
      like as LikeValueComment,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUserId() currentUserId,
  ) {
    const result = await this.commentsQueryRepository.findCommentByIdNoAuth(
      commentId,
    );
    if (!result) {
      throw new HttpException('invalid blog', 404);
    }
    const found = await this.commentsQueryRepository.findCommentByIdAndLogin(
      currentUserId,
      commentId,
    );
    if (!found) {
      throw new HttpException('invalid blog', 403);
    }
    return this.commentsService.deleteComment(commentId);
  }
}
