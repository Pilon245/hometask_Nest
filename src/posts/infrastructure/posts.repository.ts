import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/entities/posts.entity';
import { CreateLikeInputDTO, CreatePostRepo } from '../domain/dto/postsFactory';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from '../domain/entities/likes.posts.entity';
import { UpdatePostDTO } from '../domain/dto/update.posts.dto';

@Injectable({ scope: Scope.DEFAULT })
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name)
    private likePostModel: Model<LikePostDocument>,
  ) {}
  async findLikeByIdAndPostId(id: string, postId: string) {
    return this.likePostModel.findOne({
      $and: [{ userId: id }, { postId: postId }, { isBan: false }],
    });
  }
  async findPostById(id: string) {
    return this.postModel
      .findOne({ id, isBan: false }, { _id: false, __v: 0, isBan: 0 })
      .exec();
  }
  async createPosts(post: CreatePostRepo) {
    const posts = await new this.postModel(post);
    await posts.save();
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
  async updatePosts(post: UpdatePostDTO) {
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
  async banUsers(userId: string, value: boolean) {
    await this.postModel.updateMany(
      { userId: userId },
      {
        isBan: value,
      },
    );
    await this.likePostModel.updateMany(
      { userId: userId },
      {
        isBan: value,
      },
    );
    return;
  }
  async deletePosts(id: string) {
    const result = await this.postModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllPost() {
    await this.postModel.deleteMany();
    await this.likePostModel.deleteMany();
    return true;
  }
}
