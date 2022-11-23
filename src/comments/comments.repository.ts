import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comments.entity';
import { CommentsFactory, CreateLikeInputDTO } from './dto/commentsFactory';
import {
  LikeComment,
  LikeCommentDocument,
  LikeValueComment,
} from './entities/likes.comments.entity';
import { UpdateBlogInputModelType } from '../blogs/dto/update.blogs.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}
  async createComments(model: CommentsFactory) {
    const comment = await new this.commentModel(model);
    await comment.save();
    return model;
  }
  async updateComments(blog: UpdateBlogInputModelType) {
    const result = await this.commentModel.updateOne(
      { id: blog.id },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      },
    );
    return;
  }
  async findLikeByIdAndCommentId(id: string, commentId: string) {
    return await this.likeCommentModel.findOne({
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
  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }
  async deleteAllComment() {
    await this.commentModel.deleteMany({});
    return true;
  }
}
