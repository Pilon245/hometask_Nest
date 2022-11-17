import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Post, PostDocument } from './entities/posts.entity';
import {
  PostOutputModelType,
  UpdatePostInputModelType,
} from './posts.controller';
import { CreatePostInputDTO } from './dto/postsFactory';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPosts(post: CreatePostInputDTO) {
    const posts = await new this.postModel(post);
    posts.save();
    return post;
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
}
