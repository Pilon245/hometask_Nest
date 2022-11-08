import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import {
  BlogOutputModelType,
  CreateBlogInputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  createBlogs(inputModel: CreateBlogInputModelType) {
    const newBlog: BlogOutputModelType = {
      id: String(+new Date()),
      name: inputModel.name,
      youtubeUrl: inputModel.youtubeUrl,
      createdAt: new Date().toISOString(),
    };
    return this.blogsRepository.createBlogs(newBlog);
  }
  updateBlogs(id: string, model: CreateBlogInputModelType) {
    const updateBlog: UpdateBlogInputModelType = {
      id: id,
      name: model.name,
      youtubeUrl: model.youtubeUrl,
    };
    return this.blogsRepository.updateBlogs(updateBlog);
  }
  deleteBlogs(id: string) {
    return this.blogsRepository.deleteBlogs(id);
  }
}
