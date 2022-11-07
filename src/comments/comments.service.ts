import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  findCommentById(id: string) {
    return this.commentsRepository.findCommentById(id);
  }
  findCommentByPostId(postid: string) {
    return this.commentsRepository.findCommentByPostId(postid);
  }
}
