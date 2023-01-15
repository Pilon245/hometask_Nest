import { Injectable, Scope } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
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
  async findLikeByIdAndPostId(id: string, postId: string): Promise<any> {
    const like = await this.dataSource.query(`SELECT * FROM "LikePosts"
            WHERE "userId" = '${id}' AND "postId" = '${postId}'
            AND "isBanned" = false`);
    if (!like[0]) return false;
    return {
      likesStatus: like[0].likesStatus,
      dislikesStatus: like[0].dislikesStatus,
      myStatus: like[0].myStatus,
      userId: like[0].userId,
      postId: like[0].postId,
      addedAt: like[0].addedAt,
      isBanned: like[0].isBanned,
    };
  }
  async createPosts(post: CreatePostRepo) {
    await this.dataSource.query(` INSERT INTO "Posts"(
      "id", "title", "shortDescription", "content", "blogId", "createdAt", "isBanned", "userId")
    VALUES ('${post.id}', '${post.title}', '${post.shortDescription}','${post.content}' ,
      '${post.blogId}', '${post.createdAt}', '${post.isBanned}', '${post.userId}');`);
    return post;
  }
  async createLike(like: CreateLikeInputDTO) {
    await this.dataSource.query(`INSERT INTO "LikePosts"(
        "likesStatus", "dislikesStatus", "myStatus", "userId", "postId", "addedAt")
        VALUES ('${like.likesStatus}', '${like.dislikesStatus}', '${like.myStatus}',
         '${like.userId}','${like.postId}', '${like.addedAt}');`);

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
    await this.dataSource.query(`UPDATE public."LikePosts"
        SET "likesStatus"='${likesStatus}', "dislikesStatus"='${dislikesStatus}',
         "myStatus"='${myStatus}'
        WHERE "postId" = '${postId}' AND "userId" = '${userId}';`);
    return true;
  }
  async updatePosts(post: UpdatePostDTO) {
    await this.dataSource.query(`UPDATE "Posts" 
    SET  "title"='${post.title}', "shortDescription"='${post.shortDescription}',
     "content"='${post.content}', "blogId"='${post.blogId}'
    WHERE "id" = '${post.id}'`);
    return;
  }
  async banUsers(userId: string, value: boolean) {
    await this.dataSource.query(`UPDATE "Posts" 
    SET "isBanned" = ${value}
    WHERE "userId" = '${userId}'`);
    await this.likePostModel.updateMany(
      { userId: userId },
      {
        isBanned: value,
      },
    );
    return;
  }
  async deletePosts(id: string) {
    await this.dataSource.query(`DELETE FROM "Posts" WHERE "id" = '${id}'`);
    return true;
  }
  async deleteAllPost() {
    await this.dataSource.query(`DELETE FROM "Posts"`);
    await this.dataSource.query(`DELETE FROM "LikePosts"`);
    return true;
  }
}
