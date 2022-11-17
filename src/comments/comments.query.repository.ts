import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comments.entity';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from './entities/likes.comments.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}

  async findCommentById(id: string): Promise<Comment | null> {
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
  async findCommentByPostId(postId: string): Promise<Comment | null> {
    return await this.commentModel.findOne({ postId }).exec();
  }
}
