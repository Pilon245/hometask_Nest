import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/entities/posts.entity';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from '../domain/entities/likes.posts.entity';
import { SortDirection } from '../../validation/query.validation';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export type FindPostsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
};

@Injectable({ scope: Scope.DEFAULT })
export class PostsSqlQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findPostDB(id: string) {
    const post = await this.dataSource.query(
      `SELECT posts.*, blogs."name"
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "id" = '${id}' AND "isBanned" = false`,
    );
    if (post[0]) return false;
    return {
      id: post[0].id,
      title: post[0].title,
      shortDescription: post[0].shortDescription,
      content: post[0].content,
      blogId: post[0].blogId,
      blogName: post[0].name,
      createdAt: post[0].createdAt,
      userId: post[0].userId,
    };
  }
  async findPosts(
    { sortDirection, sortBy, pageSize, pageNumber }: FindPostsPayload,
    userId?: string,
  ) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const posts = await this.dataSource.query(
      `SELECT posts.*, blogs."name"
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "isBanned" = false
             ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "isBanned" = false `,
    );
    const totalCount = +valueCount[0].count;
    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });
      let likeStatus = LikeValuePost.none;
      if (userId) {
        const status = await this.likePostModel.findOne({
          $and: [{ postId: p.id }, { userId: userId }, { isBanned: false }],
        });
        likeStatus = status?.myStatus || LikeValuePost.none;
      }
      const lastLikes = await this.likePostModel
        .find({
          $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
        })
        .sort({ addedAt: 'desc' })
        .lean();

      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.name,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    });
    const items = await Promise.all(Promises);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }

  async findPostById(id: string, userId?: string) {
    const post = await this.dataSource.query(
      `SELECT posts.*, blogs."name"
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "isBanned" = false AND posts."id" = '${id}'`,
    );

    const totalLike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
    });
    const totalDislike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { dislikesStatus: 1 }, { isBanned: false }],
    });

    let likeStatus = LikeValuePost.none;
    if (userId) {
      const status = await this.likePostModel.findOne({
        $and: [{ postId: id }, { userId: userId }, { isBanned: false }],
      });
      likeStatus = status?.myStatus || LikeValuePost.none;
    }
    const lastLikes = await this.likePostModel
      .find({
        $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
      })
      .sort({ addedAt: 'desc' })
      .lean();

    if (post[0]) {
      return {
        id: post[0].id,
        title: post[0].title,
        shortDescription: post[0].shortDescription,
        content: post[0].content,
        blogId: post[0].blogId,
        blogName: post[0].name,
        createdAt: post[0].createdAt,
        extendedLikesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    }
    return post;
  }
  async findPostByBlogId(
    { sortDirection, sortBy, pageSize, pageNumber }: FindPostsPayload,
    blogId: string,
    userId?: string,
  ) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const posts = await this.dataSource.query(
      `SELECT posts.*, blogs."name"
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "blogId" = '${blogId}' AND "isBanned" = false
             ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
             FROM "Posts" as posts
             INNER JOIN "Blogs" as blogs
             ON posts."blogId" = blogs."id"
             WHERE "blogId" = '${blogId}' AND "isBanned" = false`,
    );
    const totalCount = +valueCount[0].count;
    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });

      let likeStatus = LikeValuePost.none;
      if (userId) {
        const status = await this.likePostModel.findOne({
          $and: [{ postId: p.id }, { userId: userId }, { isBanned: false }],
        });
        likeStatus = status?.myStatus || LikeValuePost.none;
      }
      const lastLikes = await this.likePostModel
        .find({
          $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
        })
        .sort({ addedAt: 'desc' })
        .lean();
      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    });
    const items = await Promise.all(Promises);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
}
