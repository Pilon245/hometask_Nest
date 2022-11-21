import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDTO } from './dto/blogsFactory';
import { UpdateBlogInputModelType } from './dto/update.blogs.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlogs(blog: CreateBlogDTO) {
    const blogs = await new this.blogModel(blog);
    console.log(blog);
    blogs.save();
    return blog;
  }
  async updateBlogs(blog: UpdateBlogInputModelType) {
    const result = await this.blogModel.updateOne(
      { id: blog.id },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      },
    );
    return;
  }
  async deleteBlogs(id: string) {
    const result = await this.blogModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
