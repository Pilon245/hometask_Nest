import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../helper/helper.function';
import { SortDirection } from '../middlewares/query.validation';

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
      login: users.accountData.login,
      email: users.accountData.email,
      createdAt: users.accountData.createdAt,
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
    // TODO: запомнить этот нюанс
    // const port = this.cfgSer.get('PORT');
    // return await this.userModel.find({}, { _id: false, __v: 0 }).exec();
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
      // .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
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
    return await this.userModel.findOne({ id }, { _id: false, __v: 0 }).lean();
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
        { 'accountData.login': LoginOrEmailL },
        { 'accountData.email': LoginOrEmailL },
      ],
    });
    return user;
  }
}
