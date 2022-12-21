import { Injectable, Scope } from '@nestjs/common';
import { Blog, BlogDocument } from '../domain/entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDTO } from '../domain/dto/blogsFactory';
import {
  BanBlogsRepo,
  UpdateBlogInputModelType,
  UpdateBlogOnNewUserRepo,
} from '../domain/dto/update.blogs.dto';

@Injectable({ scope: Scope.DEFAULT })
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async findBlogById(id: string): Promise<Blog> {
    return this.blogModel.findOne(
      { id: id, 'banInfo.isBanned': false },
      { _id: false, __v: 0, blogOwnerInfo: false, 'banInfo.isBanned': 0 },
    );
  }
  async createBlogs(blog: CreateBlogDTO) {
    //todo сделать свагер
    const blogs = await new this.blogModel(blog);
    await blogs.save();
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
  async updateBlogsOnNewUser(model: UpdateBlogOnNewUserRepo) {
    const result = await this.blogModel.updateOne(
      { id: model.id },
      {
        blogOwnerInfo: {
          userId: model.userId,
          userLogin: model.userLogin,
        },
      },
    );
    return;
  }
  async banUsers(userId: string, value: boolean) {
    const result = await this.blogModel.updateMany(
      { 'blogOwnerInfo.userId': userId },
      {
        'banInfo.isBanned': value,
      },
    );
    return;
  }
  async banBlogs(banBlogs: BanBlogsRepo) {
    const result = await this.blogModel.updateOne(
      { id: banBlogs.id },
      {
        'banInfo.isBanned': banBlogs.isBanned,
        'banInfo.banDate': banBlogs.banDate,
      },
    );
    return;
  }
  async deleteBlogs(id: string) {
    const result = await this.blogModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllBlogs() {
    await this.blogModel.deleteMany({});
    return true;
  }
}
