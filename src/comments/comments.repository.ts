import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/posts.entity';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findCommentById(id: string): Promise<Comment> {
    return await this.commentModel.findOne({ id }).exec();
  }
  async findCommentByPostId(postId: string) {
    return await this.commentModel.findOne({ postId }).exec();
  }
}
