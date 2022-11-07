import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }
}
