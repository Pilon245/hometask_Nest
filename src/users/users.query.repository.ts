import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // private cfgSer: ConfigService,
  ) {}
  async findUsers(): Promise<User[]> {
    // TODO: запомнить этот нюанс
    // const port = this.cfgSer.get('PORT');
    return await this.userModel.find().exec();
  }
  async deleteAllUsers() {
    return await this.userModel.deleteMany();
  }
}
