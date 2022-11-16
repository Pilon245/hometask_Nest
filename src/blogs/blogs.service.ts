import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateBlogInputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';
import { BlogsFactory, CreateBlogInputDTO } from './dto/blogsFactory';
import { validate, validateOrReject } from 'class-validator';
import { validateOrRejectModel } from '../helper/helper.function';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createBlogs(inputModel: CreateBlogInputDTO) {
    // await validateOrRejectModel(inputModel, CreateBlogInputModel); // Валидиация на принятые данные
    const newBlog = new BlogsFactory(
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
