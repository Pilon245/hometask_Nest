import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.entity';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import { SortDirection } from '../../validation/query.validation';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/blogger.users.blogs.ban.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export type FindUsersPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

@Injectable({ scope: Scope.DEFAULT })
export class UsersSqlQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BloggerUsersBan.name)
    private bloggerUsersBanModel: Model<BloggerUsersBanDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findUsersById(id: string) {
    const users = await this.userModel.findOne({ id }, { _id: false, __v: 0 });
    if (!users) return false;
    return {
      id: users.id,
      login: users.accountData.login,
      email: users.accountData.email,
      createdAt: users.accountData.createdAt,
      banInfo: {
        isBanned: users.banInfo.isBanned,
        banDate: users.banInfo.banDate,
        banReason: users.banInfo.banReason,
      },
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
  async findBanBloggerUsers(banUserId: string, blogId: string): Promise<User> {
    return this.bloggerUsersBanModel.findOne(
      { banUserId, blogId, 'banInfo.isBanned': true },
      { _id: false, __v: 0 },
    );
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
        banInfo: {
          isBanned: u.banInfo.isBanned,
          banDate: u.banInfo.banDate,
          banReason: u.banInfo.banReason,
        },
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
  async findUsersOnBlogger(
    bloggerId: string,
    blogId: string,
    {
      searchLoginTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
    }: FindUsersPayload,
  ) {
    const filter = {
      $and: [
        {
          login: {
            $regex: searchLoginTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
        { blogId: blogId },
        { 'banInfo.isBanned': true },
      ],
    };
    const users = await this.bloggerUsersBanModel
      .find(filter, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.bloggerUsersBanModel.countDocuments(filter);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: users.map((u) => ({
        id: u.id,
        login: u.login,
        banInfo: {
          isBanned: u.banInfo.isBanned,
          banDate: u.banInfo.banDate,
          banReason: u.banInfo.banReason,
        },
      })),
    };
  }
}
