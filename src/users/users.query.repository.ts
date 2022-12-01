import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../helper/helper.function';
import { SortDirection } from '../validation/query.validation';

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
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findUsersById(id: string) {
    const users = await this.userModel.findOne({ id }, { _id: false, __v: 0 });
    if (!users) return false;
    return {
      id: users.id,
      login: users.accountData.login,
      email: users.accountData.email,
      createdAt: users.accountData.createdAt,
    };
  }
  async findUsersByIdOnMyAccount(id: string) {
    const users = await this.userModel.findOne({ id }, { _id: false, __v: 0 });
    if (!users) return false;
    return {
      userId: users.id,
      login: users.accountData.login,
      email: users.accountData.email,
    };
  }
  async findUsers({
    searchLoginTerm,
    searchEmailTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindUsersPayload) {
    const filter = {
      $or: [
        {
          'accountData.login': {
            $regex: searchLoginTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
        {
          'accountData.email': {
            $regex: searchEmailTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
      ],
    };
    const users = await this.userModel
      .find(filter, { _id: false, __v: 0 })
      .sort([[`accountData.${sortBy}`, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.userModel.countDocuments(filter);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: users.map((u) => ({
        id: u.id,
        login: u.accountData.login,
        email: u.accountData.email,
        createdAt: u.accountData.createdAt,
      })),
    };
  }
  async findUsersForDTO(id: string): Promise<User> {
    return this.userModel.findOne({ id }, { _id: false, __v: 0 }).lean();
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    return this.userModel.findOne({
      $or: [
        { 'accountData.login': LoginOrEmailL },
        { 'accountData.email': LoginOrEmailL },
      ],
    });
  }
}
