import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comments.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findCommentById(id: string): Promise<Comment> {
    return await this.commentModel.findOne({ id }, { _id: false, __v: 0 });
  }
  async findCommentByPostId(postId: string) {
    return await this.commentModel.findOne({ postId }).exec();
  }
}
