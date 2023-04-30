import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/nosql/users.entity';
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
} from '../domain/entities/nosql/blogger.users.blogs.ban.entity';
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
  sql = `SELECT "id", "login", "email", "passwordHash", "createdAt",
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

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BloggerUsersBan.name)
    private bloggerUsersBanModel: Model<BloggerUsersBanDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {} //todo sql инъекции не сделал

  async findUsersById(id: string) {
    //todo sql injection
    const lastNameTerm = '';
    const users = await this.dataSource.query(
      `${this.sql}
    WHERE "id" = $1 OR '' = $2`,
      [id, `%${lastNameTerm}%`],
    );
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
    if (!users[0]) return false;
    return {
      userId: users[0].id,
      login: users[0].login,
      email: users[0].email,
    };
  }

  async findBanBloggerUsers(banUserId: string, blogId: string) {
    const banUser = await this.dataSource.query(
      `SELECT ban."blogId", ban."userId" as banUserId,
        ban."isBanned", ban."banDate", ban"banReason",
        users."login"
        FROM "BloggerUsersBan" as ban
        INNER JOIN  "Users" as users
        ON users."id" = ban."userId"
        WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}' AND "isBanned" = true`,
    );
    if (!banUser[0]) return false;
    return {
      id: banUser[0].userId,
      login: banUser[0].login,
      banInfo: {
        isBanned: banUser[0].isBanned,
        banDate: banUser[0].banDate,
        banReason: banUser[0].banReason,
      },
    };
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
      `SELECT count(*) FROM "Users" AS users
               LEFT JOIN "UsersBanInfo" AS ban
               ON  ban."userId" = users."id"
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
    if (sortBy === 'createdAt') {
      sortBy = 'banDate';
    }
    const skip = getSkipNumber(pageNumber, pageSize);
    const users = await this.dataSource.query(
      `SELECT ban."blogId", ban."userId" as banUserId,
        ban."isBanned", ban."banDate", ban."banReason",
        users."login", blogs."userId" 
        FROM "BloggerUsersBan" as ban
        INNER JOIN  "Users" as users
        ON users."id" = ban."userId"
        INNER JOIN "Blogs" as blogs
        ON blogs."id" = ban."blogId"
        WHERE blogs."userId" = '${bloggerId}' AND "blogId" = '${blogId}' AND
        UPPER("login") like UPPER('%${searchLoginTerm}%') AND ban."isBanned" = true
        ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip} `,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
        FROM "BloggerUsersBan" as ban
        INNER JOIN  "Users" as users
        ON users."id" = ban."userId"
        INNER JOIN "Blogs" as blogs
        ON blogs."id" = ban."blogId"
        WHERE blogs."userId" = '${bloggerId}' AND "blogId" = '${blogId}' AND
        UPPER("login") like UPPER('%${searchLoginTerm}%') AND 
        ban."isBanned" = true `,
    );
    const totalCount = +valueCount[0].count;

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: users.map((u) => ({
        id: u.banuserid,
        login: u.login,
        banInfo: {
          isBanned: u.isBanned,
          banDate: u.banDate,
          banReason: u.banReason,
        },
      })),
    };
  }
}
