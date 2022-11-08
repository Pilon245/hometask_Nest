import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.entity';
import { Model } from 'mongoose';
import { QueryDto } from '../helper/query';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async findBlogs(query: any) {
    return this.blogModel
      .find({}, { _id: false, __v: 0 }, {})
      .sort(query.sortBy)
      .lean();
  }
  async findBlogById(id: string): Promise<Blog> {
    return await this.blogModel.findOne({ id }).exec();
  }
  async deleteAllBlogs() {
    return await this.blogModel.deleteMany();
  }
}
