import { Injectable, Scope } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';

@Injectable({ scope: Scope.DEFAULT })
export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}
}
