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
} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import { UpdateCommentInputModel } from './dto/update.comments.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

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
  ) {
    const isUpdate = await this.commentsService.updateComment(
      commentId,
      updateModel.content,
    );
    console.log('isUpdate', isUpdate);
    if (!isUpdate) {
      throw new HttpException('invalid blog', 404);
    }
    return isUpdate;
  }
  // async updateLike(req: Request, res: Response) {
  //   const isUpdate = await commentsService.updateLike(
  //     req.user!.id,
  //     req.params.commentId,
  //     req.body.likeStatus,
  //   );
  //   console.log('isUpdate', isUpdate);
  //   res.send(204);
  // }
  // async deleteComment(req: Request, res: Response) {
  //   const isDelete = await commentsService.deleteComment(req.params.commentId);
  //   if (isDelete) {
  //     res.send(204);
  //   } else {
  //     res.sendStatus(404);
  //   }
  // }
}
