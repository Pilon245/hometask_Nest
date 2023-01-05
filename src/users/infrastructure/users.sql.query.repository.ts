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
    const users = await this.dataSource.query(
      `SELECT * FROM "Users"  WHERE "id" = '${id}'`,
    );
    if (!users) return false;
    return {
      id: users[0].id,
      login: users[0].login,
      email: users[0].email,
      createdAt: users[0].createdAt,
      banInfo: {
        isBanned: users[0].isBanned,
        banDate: users[0].banDate,
        banReason: users[0].banReason,
      },
    };
  }
  async findUsersByIdOnMyAccount(id: string) {
    const users = await this.dataSource.query(
      `SELECT * FROM "Users"  WHERE "id" = '${id}'`,
    );
    if (!users) return false;
    return {
      userId: users[0].id,
      login: users[0].login,
      email: users[0].email,
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
    await this.userModel
      .find(filter, { _id: false, __v: 0 })
      .sort([[`accountData.${sortBy}`, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const skip = getSkipNumber(pageNumber, pageSize);
    const users = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "login" like '%${searchLoginTerm}%' AND 
              "email" like '%${searchEmailTerm}%' 
              ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) FROM "Users" 
        WHERE "login" like '%${searchLoginTerm}%' AND 
              "email" like '%${searchEmailTerm}%' `,
    );
    const totalCount = +valueCount[0].count;
    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: users.map((u) => ({
        id: u.id,
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
        banInfo: {
          isBanned: u.isBanned,
          banDate: u.banDate,
          banReason: u.banReason,
        },
      })),
    };
  }
  async findUsersForDTO(id: string): Promise<User> {
    const result = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "id" = '${id}'`,
    );
    return result[0];
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    const result = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "login" = '${LoginOrEmailL}' OR "email" = '${LoginOrEmailL}'`,
    );
    return result[0];
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
