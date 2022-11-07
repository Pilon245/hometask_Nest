import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogSchema } from './blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import {
  BlogOutputModelType,
  CreateBlogInputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }
  async findBlogById(id: string): Promise<Blog> {
    return await this.blogModel.findOne({ id }).exec();
  }
  async createBlogs(blog: BlogOutputModelType) {
    const blogs = await new this.blogModel(blog);
    return blogs.save();
  }
  async updateBlogs(blog: UpdateBlogInputModelType) {
    const result = await this.blogModel.updateOne(
      { id: blog.id },
      {
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
      },
    );
    return;
  }
  async deleteBlogs(id: string) {
    const result = await this.blogModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllBlogs() {
    return await this.blogModel.deleteMany();
  }
}
