import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}

  async findCommentByIdAndLogin(userId: string, commentId: string) {
    return this.commentModel.findOne({
      $and: [{ id: commentId }, { userId: userId }],
    });
  }
  async findCommentByIdNoAuth(id: string) {
    const comments = await this.commentModel.findOne(
      { id },
      { _id: false, __v: 0 },
    );

    const totalLike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { likesStatus: 1 }],
    });
    const totalDislike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { dislikesStatus: 1 }],
    });
    if (comments) {
      const outComment = {
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        userLogin: comments.userLogin,
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
      { id },
      { _id: false, __v: 0 },
    );

    const totalLike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { likesStatus: 1 }],
    });
    const totalDislike = await this.likeCommentModel.countDocuments({
      $and: [{ commentId: id }, { dislikesStatus: 1 }],
    });
    const likeStatus = await this.likeCommentModel.findOne({
      $and: [{ commentId: id }, { userId: userId }],
    });

    if (comments) {
      const outComment = {
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        userLogin: comments.userLogin,
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
      .find({ postId: postId })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }],
      });
      return {
        id: c.id,
        content: c.content,
        userId: c.userId,
        userLogin: c.userLogin,
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
      .find({ postId: postId })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });

    const Promises = comments.map(async (c) => {
      const likeCount = await this.likeCommentModel.countDocuments({
        commentId: c.id,
        likesStatus: 1,
      });
      const disLikeCount = await this.likeCommentModel.countDocuments({
        $and: [{ commentId: c.id }, { dislikesStatus: 1 }],
      });
      const likeStatus = await this.likeCommentModel.findOne({
        $and: [{ commentId: c.id }, { userId: userId }],
      });
      return {
        id: c.id,
        content: c.content,
        userId: c.userId,
        userLogin: c.userLogin,
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
}
