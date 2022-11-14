import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comments.entity';
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
}
