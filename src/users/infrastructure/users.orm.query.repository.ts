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
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../domain/entities/sql/user.entity';
import { EmailConfirmation } from '../domain/entities/sql/email.confirmation.entity';
import { PasswordConfirmation } from '../domain/entities/sql/password.confirmation.entity';
import { UsersBanInfo } from '../domain/entities/sql/users.ban.info.entity';

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
export class UsersOrmQueryRepository {
  select = `SELECT "id", "login", "email", "passwordHash", "createdAt",
	email."confirmationCode" as emailConfirmationCode,
	email."expirationDate" as emailExpirationDate,
	email."isConfirmed" as emailIsConfirmed,
	pass."confirmationCode" as passConfirmationCode,
	pass."expirationDate" as passExpirationDate,
	pass."isConfirmed" as passIsConfirmed,
	ban."isBanned", ban."banDate", ban."banReason"
	FROM "users" AS users
	LEFT JOIN "email_confirmation" AS email
	ON email."userId" = users."id"
	LEFT JOIN "password_confirmation" AS pass
	ON pass."userId" = users."id"
	LEFT JOIN "users_ban_info" AS ban
	ON ban."userId" = users."id"`;

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmationRepository: Repository<EmailConfirmation>,
    @InjectRepository(PasswordConfirmation)
    private readonly passwordConfirmationRepository: Repository<PasswordConfirmation>,
    @InjectRepository(UsersBanInfo)
    private readonly usersBanInfoRepository: Repository<UsersBanInfo>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findUsersById(id: string) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select('u.*, b.* ')
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .where('id = :id', { id })
      .getRawOne();
    // const users = await this.usersRepository.find({
    //   where: { id: id },
    //   relations: {
    //     emailConfirmation: true,
    //     banInfo: true,
    //     passwordConfirmation: true,
    //   },
    // });

    // const users = await this.dataSource.query(`${this.select}
    // WHERE "id" = '${id}'`);
    if (!users) return false;

    return {
      id: users.id,
      login: users.login,
      email: users.email,
      createdAt: users.createdAt,
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async findUsersByIdOnMyAccount(id: string) {
    const users = await this.usersRepository.findOneBy({
      id: id,
    });
    if (!users) return false;
    return {
      userId: users.id,
      login: users.login,
      email: users.email,
    };
  }

  async findBanBloggerUsers(banUserId: string, blogId: string) {
    const banUser = await this.dataSource
      .createQueryBuilder()
      .select('u.*, b.* ')
      .from('bloggers_users_blogs_ban', 'ban')
      .leftJoin('users', 'u', 'b.userId = u.id')
      .where('userId = :banUserId', { banUserId })
      .andWhere('blogId = :blogId', { blogId })
      .andWhere('isBanned = true')
      .getRawOne();
    // const banUser = await this.dataSource.query(
    //   `SELECT ban."blogId", ban."userId" as banUserId,
    //     ban."isBanned", ban."banDate", ban"banReason",
    //     users."login"
    //     FROM "BloggerUsersBan" as ban
    //     INNER JOIN  "Users" as users
    //     ON users."id" = ban."userId"
    //     WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}' AND "isBanned" = true`,
    // );
    if (!banUser) return false;
    return {
      id: banUser.userId,
      login: banUser.login,
      banInfo: {
        isBanned: banUser.isBanned,
        banDate: banUser.banDate,
        banReason: banUser.banReason,
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
    // const users = await this.dataSource
    //   .createQueryBuilder()
    //   .select('u.*, b.*')
    //   .from('users', 'u')
    //   .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
    //   .where('login = :searchLoginTerm', { searchLoginTerm })
    //   .orWhere('email = :searchEmailTerm', { searchEmailTerm })
    //   .andWhere('isBanned = :banStatus', { banStatus })
    //   .orderBy(sortBy, sortDirection)
    //   .limit(pageSize)
    //   .offset(skip)
    //   .getRawOne();
    // const users = await this.dataSource.query(
    //   `${this.select}
    //   WHERE (UPPER("login") like UPPER('%${searchLoginTerm}%') OR
    //           UPPER("email") like UPPER('%${searchEmailTerm}%')) AND
    //           "isBanned" is ${banStatus}
    //           ORDER BY "${sortBy}" ${sortDirection}
    //          LIMIT ${pageSize} OFFSET  ${skip}`,
    // );
    console.log(users);
    const valueCount = await this.dataSource.query(
      `SELECT count(*) FROM "users" AS users
               LEFT JOIN "users_ban_info" AS ban
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
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('id = :id', { id })
      .getRawOne();

    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailConfirmationCode,
        expirationDate: users.emailExpirationDate,
        isConfirmed: users.emailIsConfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passConfirmationCode,
        expirationDate: users.passExpirationDate,
        isConfirmed: users.passIsConfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async findLoginOrEmail(LoginOrEmailL: string): Promise<User | boolean> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('login = :LoginOrEmailL', { LoginOrEmailL })
      .orWhere('email = :LoginOrEmailL', { LoginOrEmailL })
      .getRawOne();

    if (!users) return false;
    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailConfirmationCode,
        expirationDate: users.emailExpirationDate,
        isConfirmed: users.emailIsConfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passConfirmationCode,
        expirationDate: users.passExpirationDate,
        isConfirmed: users.passIsConfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
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
        FROM "bloggers_users_blogs_ban" as ban
        INNER JOIN  "users" as users
        ON users."id" = ban."userId"
        INNER JOIN "blogs" as blogs
        ON blogs."id" = ban."blogId"
        WHERE blogs."userId" = '${bloggerId}' AND "blogId" = '${blogId}' AND
        UPPER("login") like UPPER('%${searchLoginTerm}%') AND ban."isBanned" = true
        ORDER BY "${sortBy}" ${sortDirection}
             LIMIT ${pageSize} OFFSET  ${skip} `,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*)
        FROM "bloggers_users_blogs_ban" as ban
        INNER JOIN  "users" as users
        ON users."id" = ban."userId"
        INNER JOIN "blogs" as blogs
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
