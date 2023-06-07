import { Injectable, Scope } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from '../domain/entities/nosql/comments.entity';
import {
  CommentsFactory,
  CreateLikeInputDTO,
} from '../domain/dto/commentsFactory';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from '../domain/entities/nosql/likes.comments.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';

@Injectable({ scope: Scope.DEFAULT })
export class CommentsOrmRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createComments(model: CommentsFactory) {
    await this.dataSource.query(
      `INSERT INTO "comments"(
      "id", "content", "createdAt", "commentatorUserId", "postId", "isBanned")
    VALUES ('${model.id}', '${model.content}', '${model.createdAt}',
     '${model.commentatorInfo.userId}','${model.postInfo.id}', '${model.isBanned}')`,
    );
    return model;
  }

  async findLikeByIdAndCommentId(id: string, commentId: string): Promise<any> {
    const like = await this.dataSource.query(`SELECT * FROM "like_comments"
                    WHERE "userId" = '${id}' AND "commentId" = '${commentId}'`);
    if (!like[0]) return false;
    return {
      likesStatus: like[0].likesStatus,
      dislikesStatus: like[0].dislikesStatus,
      myStatus: like[0].myStatus,
      userId: like[0].userId,
      commentId: like[0].commentId,
      isBanned: like[0].isBanned,
    };
  }

  async createLike(like: CreateLikeInputDTO) {
    await this.dataSource.query(`INSERT INTO "like_comments"(
        "likesStatus", "dislikesStatus", "myStatus", "userId", "commentId", "isBanned")
        VALUES ('${like.likesStatus}', '${like.dislikesStatus}', '${like.myStatus}',
        '${like.userId}', '${like.commentId}', '${like.isBanned}');`);
    return like;
  }

  async updateComment(id: string, content: string) {
    const result = await this.dataSource.query(`UPDATE "comments"
        SET "content"= '${content}'
        WHERE "id" = '${id}'`);
    return result[1];
  }

  async updateLike(
    authUserId: string,
    comment: string,
    likesStatus: number,
    dislikesStatus: number,
    myStatus: LikeValueComment,
  ) {
    // const select = await this.dataSource
    //   .query(`SELECT comments."id",posts."userId" FROM "Comments" as comments
    //                     INNER JOIN "Posts" as posts
    //                     ON posts."id" = comments."postId"
    //                     WHERE "userId" = '${authUserId}'`);
    const result = await this.dataSource.query(`UPDATE public."like_comments"
            SET "likesStatus"='${likesStatus}', "dislikesStatus"='${dislikesStatus}',
             "myStatus"='${myStatus}'
            WHERE "commentId" = '${comment}' AND "userId" = '${authUserId}'`);

    return true;
  }

  async banUsers(userId: string, value: boolean) {
    // const select = await this.dataSource.query(`SELECT "id" FROM "Posts"
    //                                                    WHERE "userId" = '${userId}'`);
    await this.dataSource.query(`UPDATE public."comments"
        SET "isBanned"= '${value}'
        WHERE "commentatorUserId" = '${userId}'`);
    //todo тут наверное надо сделать JOIN

    // await this.commentModel.updateMany(
    //   { $or: [{ ownerUserId: userId }, { 'commentatorInfo.userId': userId }] },
    //   {
    //     isBanned: value,
    //   },
    // );
    await this.dataSource.query(`UPDATE public."like_comments"
            SET "isBanned"='${value}'
            WHERE "userId" = '${userId}'`);
    return;
  }

  async deleteComment(id: string): Promise<boolean> {
    await this.dataSource.query(`DELETE FROM "comments"
            WHERE "id" = '${id}'`);
    return true;
  }

  async deleteAllComment() {
    await this.dataSource.query(`DELETE FROM "comments"`);
    await this.dataSource.query(`DELETE FROM "like_comments"`);
    return true;
  }
}
