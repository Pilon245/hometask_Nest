import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateBlogInputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';
import { CreateBlogsDto } from './dto/create.blogs.dto';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  createBlogs(inputModel: CreateBlogInputModelType) {
    const newBlog = new CreateBlogsDto(
      String(+new Date()),
      inputModel.name,
      inputModel.youtubeUrl,
      new Date().toISOString(),
    );

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
