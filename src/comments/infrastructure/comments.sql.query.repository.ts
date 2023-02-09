import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from '../domain/entities/nosql/comments.entity';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from '../domain/entities/nosql/likes.comments.entity';
import { SortDirection } from '../../validation/query.validation';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeValuePost } from '../../posts/domain/entities/nosql/likes.posts.entity';

export type FindCommentsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
};

@Injectable({ scope: Scope.DEFAULT })
export class CommentsSqlQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findCommentByIdAndLogin(userId: string, commentId: string) {
    const comment = await this.dataSource.query(` 
            SELECT * FROM "Comments"
            WHERE "id" = '${commentId}' AND "commentatorUserId" = '${userId}' AND
            "isBanned" = false`);
    if (!comment[0]) return false;
    return true;
  }
  async findCommentById(id: string, userId?: string) {
    const comments = await this.dataSource.query(` 
           SELECT comments.*,posts."userId" , users."login" FROM "Comments" as comments
              INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            INNER JOIN "Users" as users
            ON users."id" = posts."userId"
            WHERE comments."id" = '${id}' AND comments."isBanned" = false`);
    const valueCount = await this.dataSource.query(
      `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${id}' AND "likesStatus" = '${1}'
            AND "isBanned" = false`,
    );
    const totalLike = +valueCount[0].count;
    const valueCountDislike = await this.dataSource.query(
      `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${id}' AND "dislikesStatus" = '${1}'
            AND "isBanned" = false`,
    );
    const totalDislike = +valueCountDislike[0].count;
    let likeStatus = LikeValueComment.none;
    if (userId) {
      const status = await this.dataSource.query(
        `SELECT * FROM "LikeComments"
            WHERE "commentId" = '${id}' AND "userId" = '${userId}'
            AND "isBanned" = false`,
      );
      likeStatus = status[0]?.myStatus || LikeValueComment.none;
    }
    if (comments[0]) {
      const outComment = {
        id: comments[0].id,
        content: comments[0].content,
        userId: comments[0].userId,
        userLogin: comments[0].login,
        createdAt: comments[0].createdAt,
        likesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus,
        },
      };
      return outComment;
    }
    return false;
  }
  async findCommentByPostId(
    { sortDirection, sortBy, pageSize, pageNumber }: FindCommentsPayload,
    postId: string,
    userId?: string,
  ) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const comments = await this.dataSource.query(` 
            SELECT comments.*,posts."userId", users."login"  FROM "Comments" as comments
            INNER JOIN "Users" as users
            ON users."id" = comments."commentatorUserId"
            INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            WHERE "postId" = '${postId}' AND comments."isBanned" = false
            ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`);

    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
             FROM "Comments" as comments
            INNER JOIN "Users" as users
            ON users."id" = comments."commentatorUserId"
            INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            WHERE "postId" = '${postId}' AND comments."isBanned" = false`,
    );
    const totalCount = +valueCount[0].count;

    const Promises = comments.map(async (c) => {
      const valueCount = await this.dataSource.query(
        `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${c.id}' AND "likesStatus" = '${1}'
            AND "isBanned" = false`,
      );
      const likeCount = +valueCount[0].count;
      const valueCountDislike = await this.dataSource.query(
        `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${c.id}' AND "dislikesStatus" = '${1}'
            AND "isBanned" = false`,
      );
      const disLikeCount = +valueCountDislike[0].count;
      let likeStatus = LikeValueComment.none;
      if (userId) {
        const status = await this.dataSource.query(
          `SELECT * FROM "LikeComments"
            WHERE "commentId" = '${c.id}' AND "userId" = '${userId}'
            AND "isBanned" = false`,
        );
        likeStatus = status[0]?.myStatus || LikeValueComment.none;
      }
      return {
        id: c.id,
        content: c.content,
        userId: c.userId,
        userLogin: c.login,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: disLikeCount,
          myStatus: likeStatus,
        },
      };
    });
    const items = await Promise.all(Promises);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
  async findCommentByBlogger(
    ownerUserId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindCommentsPayload,
  ) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const comments = await this.dataSource.query(` 
            SELECT comments."id", comments."content",
            comments."createdAt", comments."commentatorUserId",
            comments."postId", comments."isBanned",
            posts."userId", users."login", posts."title",posts."blogId" , blogs."name"
            FROM "Comments" as comments
            INNER JOIN "Users" as users
            ON users."id" = comments."commentatorUserId"
            INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            INNER JOIN "Blogs" as blogs
            ON blogs."id" = posts."blogId"
            WHERE posts."userId" = '${ownerUserId}' AND comments."isBanned" = false
            ORDER BY comments."${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`);

    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
             FROM "Comments" as comments
             INNER JOIN "Users" as users
            ON users."id" = comments."commentatorUserId"
            INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            INNER JOIN "Blogs" as blogs
            ON blogs."id" = posts."blogId"
            WHERE posts."userId" = '${ownerUserId}' AND comments."isBanned" = false`,
    );
    const totalCount = +valueCount[0].count;

    const Promises = comments.map(async (c) => {
      const valueCount = await this.dataSource.query(
        `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${c.id}' AND "likesStatus" = '${1}'
            AND "isBanned" = false`,
      );
      const likeCount = +valueCount[0].count;
      const valueCountDislike = await this.dataSource.query(
        `SELECT count(*) FROM "LikeComments"
            WHERE "commentId" = '${c.id}' AND "dislikesStatus" = '${1}'
            AND "isBanned" = false`,
      );
      const disLikeCount = +valueCountDislike[0].count;
      const status = await this.dataSource.query(
        `SELECT count(*) 
             FROM "Comments" as comments
             INNER JOIN "Users" as users
            ON users."id" = comments."commentatorUserId"
            INNER JOIN "Posts" as posts
            ON posts."id" = comments."postId"
            WHERE posts."userId" = '${ownerUserId}' AND comments."isBanned" = false`,
      );
      const likeStatus = status[0]?.myStatus;
      return {
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        commentatorInfo: {
          userId: c.commentatorUserId,
          userLogin: c.login,
        },
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: disLikeCount,
          myStatus: likeStatus?.myStatus
            ? likeStatus.myStatus
            : LikeValueComment.none,
        },
        postInfo: {
          id: c.postId,
          title: c.title,
          blogId: c.blogId,
          blogName: c.name,
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
