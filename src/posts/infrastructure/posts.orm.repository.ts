import { Injectable, Scope } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/entities/nosql/posts.entity';
import { CreateLikeInputDTO, CreatePostRepo } from '../domain/dto/postsFactory';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from '../domain/entities/nosql/likes.posts.entity';
import { UpdatePostDTO } from '../domain/dto/update.posts.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sessions } from 'src/session/domain/entities/sql/session.entity';
import { LikePosts } from 'src/posts/domain/entities/sql/like.posts.entity';
import { Posts } from 'src/posts/domain/entities/sql/posts.entity';

@Injectable({ scope: Scope.DEFAULT })
export class PostsOrmRepository {
  constructor(
    @InjectRepository(LikePosts)
    private readonly likePostsRepository: Repository<LikePosts>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findLikeByIdAndPostId(id: string, postId: string): Promise<any> {
    const like = await this.dataSource
      .createQueryBuilder()
      .select('l.*')
      .from('like_posts', 'l')
      .where('l."userId" = :id', { id })
      .andWhere('l."postId" = :postId', { postId })
      .andWhere('l."isBanned" = false')
      .getRawOne();

    if (!like) return false;
    return {
      likesStatus: like.likesStatus,
      dislikesStatus: like.dislikesStatus,
      myStatus: like.myStatus,
      userId: like.userId,
      postId: like.postId,
      addedAt: like.addedAt,
      isBanned: like.isBanned,
    };
  }

  async createPosts(post: CreatePostRepo) {
    await this.dataSource.query(` INSERT INTO "posts"(
      "id", "title", "shortDescription", "content", "blogId", "createdAt", "isBanned", "userId")
    VALUES ('${post.id}', '${post.title}', '${post.shortDescription}','${post.content}' ,
      '${post.blogId}', '${post.createdAt}', '${post.isBanned}', '${post.userId}');`);
    return post;
  }

  async createLike(like: CreateLikeInputDTO) {
    await this.dataSource.query(`INSERT INTO "like_posts"(
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
    await this.dataSource.query(`UPDATE public."like_posts"
        SET "likesStatus"='${likesStatus}', "dislikesStatus"='${dislikesStatus}',
         "myStatus"='${myStatus}'
        WHERE "postId" = '${postId}' AND "userId" = '${userId}';`);
    return true;
  }

  async updatePosts(post: UpdatePostDTO) {
    await this.dataSource.query(`UPDATE "posts" 
    SET  "title"='${post.title}', "shortDescription"='${post.shortDescription}',
     "content"='${post.content}', "blogId"='${post.blogId}'
    WHERE "id" = '${post.id}'`);
    return;
  }

  async banUsers(userId: string, value: boolean) {
    await this.dataSource.query(`UPDATE "posts" 
    SET "isBanned" = ${value}
    WHERE "userId" = '${userId}'`);
    await this.dataSource.query(`UPDATE "like_posts" 
    SET "isBanned" = ${value}
    WHERE "userId" = '${userId}'`);
    return;
  }

  async deletePosts(id: string) {
    await this.dataSource.query(`DELETE FROM "posts" WHERE "id" = '${id}'`);
    return true;
  }

  async deleteAllPost() {
    await this.dataSource.query(`DELETE FROM "posts"`);
    await this.dataSource.query(`DELETE FROM "like_posts"`);
    return true;
  }
}
