import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/entities/comments.entity';
import {
  CommentsFactory,
  CreateLikeInputDTO,
} from '../domain/dto/commentsFactory';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from '../domain/entities/likes.comments.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class CommentsSqlRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async createComments(model: CommentsFactory) {
    await this.dataSource.query(
      `INSERT INTO "Comments"(
      "id", "content", "createdAt", "commentatorUserId", "postId", "isBanned")
    VALUES ('${model.id}', '${model.content}', '${model.createdAt}',
     '${model.commentatorInfo.userId}','${model.postInfo.id}', '${model.isBanned}')`,
    );
    return model;
  }
  async findLikeByIdAndCommentId(id: string, commentId: string) {
    return this.likeCommentModel.findOne({
      $and: [{ userId: id }, { commentId: commentId }],
    });
  }
  async createLike(like: CreateLikeInputDTO) {
    await this.dataSource.query(`INSERT INTO "LikeComments"(
        "likesStatus", "dislikesStatus", "myStatus", "userId", "commentId", "isBanned")
        VALUES ('${like.likesStatus}', '${like.dislikesStatus}', '${like.myStatus}',
        '${like.userId}', '${like.commentId}', '${like.isBanned}');`);
    return like;
  }
  async updateComment(id: string, content: string) {
    await this.dataSource.query(`UPDATE "Comments"
        SET "content"= '${content}'
        WHERE "id" = '${id}'`);
    return true;
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
    const result = await this.dataSource.query(`UPDATE public."LikeComments"
            SET "likesStatus"='${likesStatus}', "dislikesStatus"='${dislikesStatus}',
             "myStatus"='${myStatus}'
            WHERE "commentId" = '${comment}' AND "userId" = '${authUserId}'`);

    return true;
  }
  async banUsers(userId: string, value: boolean) {
    // const select = await this.dataSource.query(`SELECT "id" FROM "Posts"
    //                                                    WHERE "userId" = '${userId}'`);
    await this.dataSource.query(`UPDATE public."Comments"
        SET "isBanned"= '${value}'
        WHERE "commentatorUserId" = '${userId}'`);
    //todo тут наверное надо сделать JOIN

    // await this.commentModel.updateMany(
    //   { $or: [{ ownerUserId: userId }, { 'commentatorInfo.userId': userId }] },
    //   {
    //     isBanned: value,
    //   },
    // );
    await this.dataSource.query(`UPDATE public."LikeComments"
            SET "isBanned"='${value}'
            WHERE "userId" = '${userId}'`);
    return;
  }
  async deleteComment(id: string): Promise<boolean> {
    await this.dataSource.query(`DELETE FROM "Comments"
            WHERE "id" = '${id}'`);
    return true;
  }
  async deleteAllComment() {
    await this.dataSource.query(`DELETE FROM "Comments"`);
    await this.dataSource.query(`DELETE FROM "LikeComments"`);
    return true;
  }
}
