import { Injectable } from '@nestjs/common';
import { Blog } from '../blogs/blog.entity';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/posts.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // private cfgSer: ConfigService,
  ) {}

  async createUsers(user: any) {
    const users = await new this.userModel(user);
    return users.save();
  }
  async deleteUsers(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
