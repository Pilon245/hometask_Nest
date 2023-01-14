import { Injectable, Scope } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { PostsSqlRepository } from '../infrastructure/posts.sql.repository';

@Injectable({ scope: Scope.DEFAULT })
export class PostsService {
  constructor(protected postsRepository: PostsSqlRepository) {}
}
