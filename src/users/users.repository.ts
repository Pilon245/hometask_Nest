import { Injectable } from '@nestjs/common';
import { Blog } from '../blogs/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/posts.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async createUsers(user: any) {
    const blogs = await new this.userModel(user);
    return blogs.save();
  }
  async deleteUsers(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllUsers() {
    return await this.userModel.deleteMany();
  }
}
