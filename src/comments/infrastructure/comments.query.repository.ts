import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/entities/comments.entity';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from '../domain/entities/likes.comments.entity';
import { SortDirection } from '../../validation/query.validation';
import { getSkipNumber, outputModel } from '../../helper/helper.function';

export type FindCommentsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
};

@Injectable({ scope: Scope.DEFAULT })
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}

  async findCommentByIdAndLogin(userId: string, commentId: string) {
    return this.commentModel.findOne(
      {
        $and: [
          { id: commentId },
          { 'commentatorInfo.userId': userId },
          { isBanned: false },
        ],
      },
      { _id: false, __v: 0, isBanned: 0 },
    );
  }
  async findCommentById(id: string, userId?: string) {
    const comments = await this.commentModel.findOne(
      { id, isBanned: false },
      { _id: false, __v: 0, isBanned: 0, postInfo: 0 },
    );

    const totalLike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { likesStatus: 1 }, { isBanned: false }],
    });
    const totalDislike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { dislikesStatus: 1 }, { isBanned: false }],
    });
    let likeStatus = LikeValueComment.none;
    if (userId) {
      const status = await this.likeCommentModel.findOne({
        $and: [
          { commentId: id },
          { 'commentatorInfo.userId': userId },
          { isBanned: false },
        ],
      });
      likeStatus = status?.myStatus || LikeValueComment.none;
    }
    if (comments) {
      const outComment = {
        id: comments.id,
        content: comments.content,
        userId: comments.commentatorInfo.userId,
        userLogin: comments.commentatorInfo.userLogin,
        createdAt: comments.createdAt,
        likesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus,
        },
      };
      return outComment;
    }
    return comments;
  }
  async findCommentByPostId(
    { sortDirection, sortBy, pageSize, pageNumber }: FindCommentsPayload,
    postId: string,
    userId?: string,
  ) {
    const comments = await this.commentModel
      .find(
        { postId: postId, isBanned: false },
        { _id: 0, __v: 0, isBanned: 0 },
      )
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
      isBanned: false,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
        isBanned: false,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });
      let likeStatus = LikeValueComment.none;
      if (userId) {
        const status = await this.likeCommentModel.findOne({
          $and: [
            { commentId: c.id },
            { 'commentatorInfo.userId': userId },
            { isBanned: false },
          ],
        });
        likeStatus = status?.myStatus || LikeValueComment.none;
      }
      return {
        id: c.id,
        content: c.content,
        userId: c.commentatorInfo.userId,
        userLogin: c.commentatorInfo.userLogin,
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
    const filter = {
      $and: [
        {
          ownerUserId: ownerUserId,
        },
        {
          isBanned: false,
        },
      ],
    };
    const comments = await this.commentModel
      .find(filter, { _id: 0, __v: 0, isBanned: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      ownerUserId: ownerUserId,
      isBanned: false,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
        isBanned: false,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });
      const likeStatus = await this.likeCommentModel.findOne({
        $and: [
          { commentId: c.id },
          { 'commentatorInfo.userId': ownerUserId },
          { isBanned: false },
        ],
      });
      return {
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        commentatorInfo: {
          userId: c.commentatorInfo.userId,
          userLogin: c.commentatorInfo.userLogin,
        },
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: disLikeCount,
          myStatus: likeStatus?.myStatus
            ? likeStatus.myStatus
            : LikeValueComment.none,
        },
        postInfo: {
          id: c.postInfo.id,
          title: c.postInfo.title,
          blogId: c.postInfo.blogId,
          blogName: c.postInfo.blogName,
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
