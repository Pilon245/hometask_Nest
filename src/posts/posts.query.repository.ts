import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async findPosts(): Promise<Post[]> {
    return await this.postModel.find({}, { _id: false, __v: 0 }).exec();
  }
  async findPostById(id: string): Promise<Post> {
    return await this.postModel.findOne({ id }, { _id: false, __v: 0 }).exec();
  }
  async findPostByBlogId(blogId: string): Promise<Post[] | null> {
    return await this.postModel.find({ blogId }, { _id: false, __v: 0 }).exec();
  }
  async deleteAllPosts() {
    return await this.postModel.deleteMany();
  }
}
