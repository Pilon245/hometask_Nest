import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogSchema } from './blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import {
  BlogOutputModelType,
  UpdateBlogInputModelType,
} from './blogs.controller';
// import ObjectId = module

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlogs(blog: BlogOutputModelType) {
    const blogs = await new this.blogModel(blog);
    blogs.save();
    return blog;
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
}
