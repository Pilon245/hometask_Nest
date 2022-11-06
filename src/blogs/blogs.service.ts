import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  findBlogs(term: string) {
    return this.blogsRepository.findBlogs(term);
  }
}
