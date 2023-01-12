import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.entity';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import {
  banStatusEnum,
  SortDirection,
} from '../../validation/query.validation';
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
  banStatus?: banStatusEnum;
};

@Injectable({ scope: Scope.DEFAULT })
export class UsersSqlQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BloggerUsersBan.name)
    private bloggerUsersBanModel: Model<BloggerUsersBanDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  select = `SELECT "id", "login", "email", "passwordHash", "createdAt",
	email."confirmationCode" as emailConfirmationCode,
	email."expirationDate" as emailExpirationDate,
	email."isConfirmed" as emailIsConfirmed,
	pass."confirmationCode" as passConfirmationCode,
	pass."expirationDate" as passExpirationDate,
	pass."isConfirmed" as passIsConfirmed,
	ban."isBanned", ban."banDate", ban."banReason"
	FROM "Users" AS users
	LEFT JOIN "EmailConfirmation" AS email
	ON email."userId" = users."id"
	LEFT JOIN "PasswordConfirmation" AS pass
	ON pass."userId" = users."id"
	LEFT JOIN "UsersBanInfo" AS ban
	ON ban."userId" = users."id"`;

  async findUsersById(id: string) {
    const users = await this.dataSource.query(`${this.select}
    WHERE "id" = '${id}'`);
    if (!users[0]) return false;
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
      `${this.select}  WHERE "id" = '${id}'`,
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
    banStatus,
  }: FindUsersPayload) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const users = await this.dataSource.query(
      `${this.select}
      WHERE (UPPER("login") like UPPER('%${searchLoginTerm}%') OR 
              UPPER("email") like UPPER('%${searchEmailTerm}%')) AND 
              "isBanned" is ${banStatus}
              ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) FROM "Users" 
        WHERE (UPPER("login") like UPPER('%${searchLoginTerm}%') OR 
              UPPER("email") like UPPER('%${searchEmailTerm}%')) AND 
              "isBanned" is ${banStatus} `,
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
    const users = await this.dataSource.query(
      `${this.select}
        WHERE "id" = '${id}'`,
    );
    return {
      id: users[0].id,
      accountData: {
        login: users[0].login,
        email: users[0].email,
        passwordHash: users[0].passwordHash,
        createdAt: users[0].createdAt,
      },
      emailConfirmation: {
        confirmationCode: users[0].emailConfirmationCode,
        expirationDate: users[0].emailExpirationDate,
        isConfirmed: users[0].emailIsConfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passConfirmationCode,
        expirationDate: users[0].passExpirationDate,
        isConfirmed: users[0].passIsConfirmed,
      },
      banInfo: {
        isBanned: users[0].isBanned,
        banDate: users[0].banDate,
        banReason: users[0].banReason,
      },
    };
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User | boolean> {
    const users = await this.dataSource.query(
      `${this.select}
        WHERE "login" = '${LoginOrEmailL}' OR "email" = '${LoginOrEmailL}'`,
    );
    if (!users[0]) return false;
    return {
      id: users[0].id,
      accountData: {
        login: users[0].login,
        email: users[0].email,
        passwordHash: users[0].passwordHash,
        createdAt: users[0].createdAt,
      },
      emailConfirmation: {
        confirmationCode: users[0].emailConfirmationCode,
        expirationDate: users[0].emailExpirationDate,
        isConfirmed: users[0].emailIsConfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passConfirmationCode,
        expirationDate: users[0].passExpirationDate,
        isConfirmed: users[0].passIsConfirmed,
      },
      banInfo: {
        isBanned: users[0].isBanned,
        banDate: users[0].banDate,
        banReason: users[0].banReason,
      },
    };
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
