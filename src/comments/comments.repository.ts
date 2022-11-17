import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comments.entity';
import { CreateCommentsDto } from './dto/create.comments.dto';
import { UpdateBlogInputModelType } from '../blogs/blogs.controller';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async createComments(model: CreateCommentsDto) {
    const comment = new this.commentModel(model);
    await comment.save();
    return model;
  }
  async updateComments(blog: UpdateBlogInputModelType) {
    const result = await this.commentModel.updateOne(
      { id: blog.id },
      {
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
      },
    );
    return;
  }
  // async findCommentById(id: string) {
  //   return await CommentsModelClass.findOne({ id: id });
  // }
  // async findLikeByIdAndCommentId(
  //   id: string,
  //   commentId: string,
  // ): Promise<LikeCommentStatusDBType | null> {
  //   return await LikePostModelClass.findOne({
  //     $and: [{ userId: id }, { commentId: commentId }],
  //   });
  // }
  // async createLike(like: LikeCommentStatusDBType) {
  //   const likeInstance = new LikeCommentModelClass(like);
  //   await likeInstance.save();
  //
  //   return likeInstance;
  // }
  // async updateComment(id: string, content: string) {
  //   const result = await CommentsModelClass.updateOne(
  //     { id: id },
  //     {
  //       $set: {
  //         content,
  //       },
  //     },
  //   );
  //   return result.matchedCount === 1;
  // }
  // async updateLike(
  //   authUserId: string,
  //   comment: string,
  //   likesStatus: number,
  //   dislikesStatus: number,
  //   myStatus: LikeValue,
  // ) {
  //   const result = await LikeCommentModelClass.updateOne(
  //     { $and: [{ commentId: comment }, { authUserId: authUserId }] },
  //     {
  //       $set: {
  //         likesStatus: likesStatus,
  //         dislikesStatus: dislikesStatus,
  //         myStatus: myStatus,
  //       },
  //     },
  //   );
  //   return result.matchedCount === 1;
  // }
  // async deleteComment(id: string): Promise<boolean> {
  //   const result = await CommentsModelClass.deleteOne({ id: id });
  //   return result.deletedCount === 1;
  // }
  // async deleteAllComment() {
  //   await CommentsModelClass.deleteMany({});
  //   return true;
  // }
}
