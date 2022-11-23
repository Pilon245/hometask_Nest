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

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getCommentById(@Param('id') id: string, @Query() query) {
    const resultFound =
      await this.commentsQueryRepository.findCommentByIdNoAuth(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.commentsQueryRepository.findCommentByIdNoAuth(id);
  }
  // async getComment(req: Request, res: Response) {
  //   const { pageNumber, pageSize, sortBy, sortDirection } = queryValidation(
  //     req.query,
  //   );
  //   if (req.user) {
  //     const foundComments = await commentsQueryRepository.findCommentOnPost(
  //       req.params.postId,
  //       req.user.id,
  //       {
  //         pageNumber,
  //         pageSize,
  //         sortBy,
  //         sortDirection,
  //       },
  //     );
  //     return res.status(200).send(foundComments);
  //   }
  //   if (!req.user) {
  //     const foundComments =
  //       await commentsQueryRepository.findCommentOnPostNoAuth(
  //         req.params.postId,
  //         {
  //           pageNumber,
  //           pageSize,
  //           sortBy,
  //           sortDirection,
  //         },
  //       );
  //     return res.status(200).send(foundComments);
  //   }
  // }
  // async getCommentById(req: Request, res: Response) {
  //   if (req.user) {
  //     const comment = await commentsQueryRepository.findComments(
  //       req.params.id,
  //       req.user.id,
  //     );
  //     if (comment) {
  //       res.status(200).send(comment);
  //     } else {
  //       res.send(404);
  //     }
  //   }
  //   if (!req.user) {
  //     const comment = await commentsQueryRepository.findCommentsNotAuth(
  //       req.params.id,
  //     );
  //     if (comment) {
  //       res.status(200).send(comment);
  //     } else {
  //       res.send(404);
  //     }
  //   }
  // }
  // async createComment(@Param(":postId") postId: string,
  //                     @Body() inputModel: ) {
  //   const newComment = await this.commentsService.createComment(
  //     req.params.postId,
  //     req.body.content,
  //     req.user!.id,
  //     req.user!.accountData.login,
  //   );
  //   if (newComment) {
  //     res.status(201).send(newComment);
  //   }
  // }
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
