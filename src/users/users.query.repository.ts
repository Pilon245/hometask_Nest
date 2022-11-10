import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { SortDirection } from '../blogs/blogs.controller';
import {
  getPagesCounts,
  getSkipNumber,
  outputModel,
} from '../helper/helper.function';

export type FindUsersPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // private cfgSer: ConfigService,
  ) {}
  async findUsers({
    searchLoginTerm,
    searchEmailTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindUsersPayload) {
    // TODO: запомнить этот нюанс
    // const port = this.cfgSer.get('PORT');
    // return await this.userModel.find({}, { _id: false, __v: 0 }).exec();
    const filter = {
      $or: [
        {
          login: {
            $regex: searchLoginTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
        {
          email: {
            $regex: searchEmailTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
      ],
    };
    const users = await this.userModel
      .find(filter, { _id: false, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.userModel.countDocuments(filter);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: users.map((u) => ({
        id: u.id,
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
      })),
    };
  }
  async deleteAllUsers() {
    const result = await this.userModel.deleteMany();
    return result;
  }
}
