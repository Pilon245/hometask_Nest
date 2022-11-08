import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import {
  BlogOutputModelType,
  CreateBlogInputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';
import { Prop } from '@nestjs/mongoose';

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

export class CreateBlogsDto {
  constructor(
    public id: string,
    public name: string,
    public youtubeUrl: string, // todo  почему не светится ютуб
    public createdAt: string,
  ) {}
}
