import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }
}
