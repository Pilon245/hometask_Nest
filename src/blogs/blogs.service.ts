import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { BlogsFactory, CreateBlogInputDTO } from './dto/blogsFactory';
import { UpdateBlogInputModelType } from './dto/update.blogs.dto';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createBlogs(inputModel: CreateBlogInputDTO) {
    const newBlog = new BlogsFactory(
      String(+new Date()),
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      new Date().toISOString(),
    );
    return this.blogsRepository.createBlogs(newBlog);
  }
  updateBlogs(id: string, model: UpdateBlogInputModelType) {
    const updateBlog: UpdateBlogInputModelType = {
      //todo перенсти на фактори и для чего это нужно
      id: id,
      name: model.name,
      description: model.description,
      websiteUrl: model.websiteUrl,
    };
    return this.blogsRepository.updateBlogs(updateBlog);
  }
  deleteBlogs(id: string) {
    return this.blogsRepository.deleteBlogs(id);
  }
  async deleteAllBlogs() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
