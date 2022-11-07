import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Post, PostDocument } from './posts.entity';
import {
  PostOutputModelType,
  UpdatePostInputModelType,
} from './posts.controller';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findPosts(): Promise<Post[]> {
    return await this.postModel.find().exec();
  }
  async findPostById(id: string): Promise<Post> {
    return await this.postModel.findOne({ id }).exec();
  }
  async findPostByBlogId(blogId: string): Promise<Post[]> {
    return await this.postModel.find({ blogId }).exec();
  }
  async createPosts(post: PostOutputModelType) {
    const blogs = await new this.postModel(post);
    return blogs.save();
  }
  async updatePosts(post: UpdatePostInputModelType) {
    const result = await this.postModel.updateOne(
      { id: post.id },
      {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
      },
    );
    return;
  }
  async deletePosts(id: string) {
    const result = await this.postModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllPosts() {
    return await this.postModel.deleteMany();
  }
}
