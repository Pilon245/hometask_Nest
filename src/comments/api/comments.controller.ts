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
  Req,
  Res,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import {
  UpdateCommentInputModel,
  UpdateCommentLikeInputModel,
  UpdateLikeCommentUseCaseDto,
} from '../domain/dto/update.comments.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LikeValueComment } from '../domain/entities/nosql/likes.comments.entity';
import { BearerAuthGuardOnGet } from '../../auth/guards/bearer-auth-guard-on-get.service';
import { CurrentUserId } from '../../auth/current-user.param.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCommentCommand } from '../application/use-cases/update.comment.use.cases';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateLikeCommentCommand } from '../application/use-cases/update.like.comment.use.cases';
import { UpdateCommentUseCaseDto } from '../domain/dto/commentsFactory';
import { DeleteCommentCommand } from '../application/use-cases/delete.comment.use.cases';
import { Response } from 'express';
import { CommentsSqlQueryRepository } from '../infrastructure/comments.sql.query.repository';
import { CommentsOrmQueryRepository } from 'src/comments/infrastructure/comments.orm.query.repository';

@ApiTags('comments')
@Controller({
  path: 'comments',
  scope: Scope.DEFAULT,
})
export class CommentsController {
  constructor(
    protected commentsQueryRepository: CommentsOrmQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(BearerAuthGuardOnGet)
  @Get(':id')
  async getCommentById(@Param('id') id: string, @Req() req) {
    const resultFound = await this.commentsQueryRepository.findCommentById(
      id,
      req.user?.id,
    );
    if (!resultFound) {
      throw new HttpException({}, 404);
    }

    return resultFound;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() inputModel: UpdateCommentInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const updateComment: UpdateCommentUseCaseDto = {
      id: commentId,
      content: inputModel.content,
    };
    const isUpdate = await this.commandBus.execute(
      new UpdateCommentCommand(updateComment),
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
    const resultFound = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const like = updateModel.likeStatus;
    const likeComment: UpdateLikeCommentUseCaseDto = {
      userId: currentUserId,
      commentId: commentId,
      value: like as LikeValueComment,
    };
    return this.commandBus.execute(new UpdateLikeCommentCommand(likeComment));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUserId() currentUserId,
  ) {
    const result = await this.commentsQueryRepository.findCommentById(
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
    return this.commandBus.execute(new DeleteCommentCommand(commentId));
  }
}
