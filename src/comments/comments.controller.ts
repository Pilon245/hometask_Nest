import { Controller, Get, HttpException, Param } from '@nestjs/common';
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
  async getComment(@Param('id') id: string) {
    const resultFound = await this.commentsQueryRepository.findCommentById(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.commentsQueryRepository.findCommentById(id);
  }
}
