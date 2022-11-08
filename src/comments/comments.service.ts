import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}
}
