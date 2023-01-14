import { Injectable, Scope } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersSqlRepository } from '../../users/infrastructure/users.sql.repository';
import { PostsSqlRepository } from '../../posts/infrastructure/posts.sql.repository';

@Injectable({ scope: Scope.DEFAULT })
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsSqlRepository,
    protected usersRepository: UsersSqlRepository,
  ) {}
}
