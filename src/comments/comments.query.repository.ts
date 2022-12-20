import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comments.entity';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from './entities/likes.comments.entity';
import { SortDirection } from '../validation/query.validation';
import { getSkipNumber, outputModel } from '../helper/helper.function';

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
          { isBan: false },
        ],
      },
      { _id: false, __v: 0, isBan: 0 },
    );
  }
  async findCommentByIdNoAuth(id: string) {
    const comments = await this.commentModel.findOne(
      { id, isBan: false },
      { _id: false, __v: 0, isBan: 0, postInfo: 0 },
    );

    const totalLike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { likesStatus: 1 }, { isBan: false }],
    });
    const totalDislike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { dislikesStatus: 1 }, { isBan: false }],
    });
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
          myStatus: LikeValueComment.none,
        },
      };
      return outComment;
    }
    return comments;
  }
  async findCommentById(id: string, userId: string) {
    const comments = await this.commentModel.findOne(
      { id, isBan: false },
      { _id: false, __v: 0, isBan: 0, commentatorInfo: 0, postInfo: 0 },
    );

    const totalLike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { likesStatus: 1 }, { isBan: false }],
    });
    const totalDislike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { dislikesStatus: 1 }, { isBan: false }],
    });
    const likeStatus = await this.likeCommentModel.findOne({
      $and: [
        { commentId: id },
        { 'commentatorInfo.userId': userId },
        { isBan: false },
      ],
    });

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
          myStatus: likeStatus?.myStatus
            ? likeStatus?.myStatus
            : LikeValueComment.none,
        },
      };
      return outComment;
    }
    return comments;
  }
  async findCommentByPostIdNoAuth(
    postId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindCommentsPayload,
  ) {
    const comments = await this.commentModel
      .find({ postId: postId, isBan: false }, { _id: 0, __v: 0, isBan: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
      isBan: false,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
        isBan: false,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }, { isBan: false }],
      });
      return {
        id: c.id,
        content: c.content,
        userId: c.commentatorInfo.userId,
        userLogin: c.commentatorInfo.userLogin,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: disLikeCount,
          myStatus: LikeValueComment.none,
        },
      };
    });
    const items = await Promise.all(Promises);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
  async findCommentByPostId(
    postId: string,
    userId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindCommentsPayload,
  ) {
    const comments = await this.commentModel
      .find({ postId: postId, isBan: false }, { _id: 0, __v: 0, isBan: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
      isBan: false,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
        isBan: false,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }, { isBan: false }],
      });
      const likeStatus = await this.likeCommentModel.findOne({
        $and: [
          { commentId: c.id },
          { 'commentatorInfo.userId': userId },
          { isBan: false },
        ],
      });
      return {
        id: c.id,
        content: c.content,
        userId: c.commentatorInfo.userId,
        userLogin: c.commentatorInfo.userLogin,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: disLikeCount,
          myStatus: likeStatus?.myStatus
            ? likeStatus.myStatus
            : LikeValueComment.none,
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
          isBan: false,
        },
      ],
    };
    const comments = await this.commentModel
      .find(filter, { _id: 0, __v: 0, isBan: 0, userId: 0, userLogin: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      ownerUserId: ownerUserId,
      isBan: false,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
        isBan: false,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }, { isBan: false }],
      });
      const likeStatus = await this.likeCommentModel.findOne({
        $and: [
          { commentId: c.id },
          { 'commentatorInfo.userId': ownerUserId },
          { isBan: false },
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
