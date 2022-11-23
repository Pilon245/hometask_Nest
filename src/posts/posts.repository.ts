import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Post, PostDocument } from './entities/posts.entity';
import {
  PostOutputModelType,
  UpdatePostInputModelType,
} from './posts.controller';
import { CreateLikeInputDTO, CreatePostInputDTO } from './dto/postsFactory';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from './entities/likes.posts.entity';
import { LikeCommentDocument } from '../comments/entities/likes.comments.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name)
    private likePostModel: Model<LikePostDocument>,
  ) {}
  async findLikeByIdAndPostId(id: string, postId: string) {
    return await this.likePostModel.findOne({
      $and: [{ userId: id }, { postId: postId }],
    });
  }
  async createPosts(post: CreatePostInputDTO) {
    const posts = await new this.postModel(post);
    posts.save();
    return post;
  }
  async createLike(like: CreateLikeInputDTO) {
    const likeInstance = await new this.likePostModel(like);
    await likeInstance.save();

    return like;
  }
  async updateLike(
    userId: string,
    postId: string,
    likesStatus: number,
    dislikesStatus: number,
    myStatus: LikeValuePost,
    login: string,
    addedAt: string,
  ) {
    const result = await this.likePostModel.updateOne(
      { $and: [{ postId: postId }, { userId: userId }] },
      {
        likesStatus,
        dislikesStatus,
        myStatus,
        login,
        addedAt,
      },
    );
    return result.matchedCount === 1;
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
