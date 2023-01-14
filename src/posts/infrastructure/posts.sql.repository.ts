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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class PostsSqlRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name)
    private likePostModel: Model<LikePostDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findLikeByIdAndPostId(id: string, postId: string) {
    return this.likePostModel.findOne({
      $and: [{ userId: id }, { postId: postId }, { isBanned: false }],
    });
  }
  async findPostById(id: string) {
    return this.postModel
      .findOne({ id, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .exec();
  }
  async createPosts(post: CreatePostRepo) {
    await this.dataSource.query(` INSERT INTO "Posts"(
      "id", "title", "shortDescription", "content", "blogId", "createdAt", "isBanned", "userId")
    VALUES ('${post.id}', '${post.title}', '${post.shortDescription}','${post.content}' ,
      '${post.blogId}', '${post.createdAt}', '${post.isBanned}', '${post.userId}');`);
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
        isBanned: value,
      },
    );
    await this.likePostModel.updateMany(
      { userId: userId },
      {
        isBanned: value,
      },
    );
    return;
  }
  async deletePosts(id: string) {
    const result = await this.postModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllPost() {
    await this.dataSource.query(`DELETE FROM "Posts"`);
    await this.likePostModel.deleteMany();
    return true;
  }
}
