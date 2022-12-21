import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/entities/comments.entity';
import { CreateLikeInputDTO } from '../domain/dto/commentsFactory';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from '../domain/entities/likes.comments.entity';

@Injectable({ scope: Scope.DEFAULT })
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}
  async createComments(model: any) {
    const comment = await new this.commentModel(model);
    await comment.save();
    return model;
  }
  async findLikeByIdAndCommentId(id: string, commentId: string) {
    return this.likeCommentModel.findOne({
      $and: [{ userId: id }, { commentId: commentId }],
    });
  }
  async createLike(like: CreateLikeInputDTO) {
    const likeInstance = await new this.likeCommentModel(like);
    await likeInstance.save();
    return like;
  }
  async updateComment(id: string, content: string) {
    const result = await this.commentModel.updateOne(
      { id: id },
      {
        $set: {
          content,
        },
      },
    );
    return result.matchedCount === 1;
  }
  async updateLike(
    authUserId: string,
    comment: string,
    likesStatus: number,
    dislikesStatus: number,
    myStatus: LikeValueComment,
  ) {
    const result = await this.likeCommentModel.updateOne(
      { $and: [{ commentId: comment }, { authUserId: authUserId }] },
      {
        $set: {
          likesStatus: likesStatus,
          dislikesStatus: dislikesStatus,
          myStatus: myStatus,
        },
      },
    );
    return result.matchedCount === 1;
  }
  async banUsers(userId: string, value: boolean) {
    await this.commentModel.updateMany(
      { ownerUserId: userId },
      {
        isBanned: value,
      },
    );
    await this.likeCommentModel.updateMany(
      { ownerUserId: userId },
      {
        isBanned: value,
      },
    );
    return;
  }
  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }
  async deleteAllComment() {
    await this.commentModel.deleteMany({});
    await this.likeCommentModel.deleteMany({});
    return true;
  }
}
