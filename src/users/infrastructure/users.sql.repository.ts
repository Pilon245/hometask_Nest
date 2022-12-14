import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/entities/users.entity';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/blogger.users.blogs.ban.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class UsersSqlRepository {
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
    const users = await this.dataSource.query(
      `${this.select}
        WHERE "id" = '${id}' `,
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

  async findLoginOrEmail(LoginOrEmailL: string) {
    const users = await this.dataSource.query(
      `${this.select} 
        WHERE "login" = '${LoginOrEmailL}' OR "email" = '${LoginOrEmailL}'`,
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

  async findBanBloggerUsersDB(
    banUserId: string,
    blogId: string,
  ): Promise<User> {
    return this.bloggerUsersBanModel.findOne({
      $and: [{ id: banUserId }, { blogId }],
    });
  }
  async updateEmailConfirmation(id: string) {
    const result = await this.dataSource.query(
      `UPDATE "EmailConfirmed"
	SET "isConfirmed"=True
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordConfirmation(id: string) {
    const result = await this.dataSource.query(
      `UPDATE "PasswordConfirmed"
	SET "isConfirmed"=True
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updateEmailCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "EmailConfirmed"
	SET "confirmationCode"='${code}'
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "PasswordConfirmed"
	SET "confirmationCode"='${code}'
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordUsers(id: string, password: string) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "passwordHash"='${password}'
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async findUserByConfirmationEmailCode(emailConfirmationCode: string) {
    const users = await this.dataSource.query(
      `${this.select}
        WHERE email."confirmationCode" = '${emailConfirmationCode}' `,
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

  async findUserByConfirmationPasswordCode(passwordConfirmation: string) {
    const users = await this.dataSource.query(
      `${this.select}
        WHERE pass."confirmationCode" = '${passwordConfirmation}' `,
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

  async createUsers(user: any) {
    const users = await this.dataSource.query(`
    INSERT INTO "Users"(
    "id", "login", "email", "passwordHash", "createdAt")
    VALUES ('${user.id}', '${user.accountData.login}', '${user.accountData.email}',
     '${user.accountData.passwordHash}', '${user.accountData.createdAt}');
     
    INSERT INTO "EmailConfirmation"(
    "userId", "confirmationCode", "expirationDate", "isConfirmed")
    VALUES ('${user.id}', '${user.emailConfirmation.confirmationCode}', 
    '${user.emailConfirmation.expirationDate}', '${user.emailConfirmation.isConfirmed}');
    
    INSERT INTO "PasswordConfirmation"(
    "userId", "confirmationCode", "expirationDate", "isConfirmed")
    VALUES ('${user.id}', '${user.passwordConfirmation.confirmationCode}',
     '${user.passwordConfirmation.expirationDate}', '${user.passwordConfirmation.isConfirmed}');
     
    INSERT INTO "UsersBanInfo"(
    "userId", "isBanned", "banDate", "banReason")
    VALUES ('${user.id}', '${user.banInfo.isBanned}', '${user.banInfo.banDate}', 
    '${user.banInfo.banReason}');`);

    return;
  }

  async banBloggerUsers(user: any) {
    const banUsers = await new this.bloggerUsersBanModel(user);
    return banUsers.save();
  }

  async updateUsers(model: any) {
    const result = await this.dataSource.query(
      `UPDATE "UsersBanInfo"
	SET "isBanned"='${model.isBanned}', "banDate" = '${model.banDate}',
	 "banReason" = '${model.banReason}'
	WHERE "userId" = '${model.id}';`,
    );
    return result[0];
  }

  async updateBanBloggerUsers(
    banUserId: string,
    bloggerId: string,
    blogId: string,
    isBanned: boolean,
    banDate: string,
    banReason: string,
  ) {
    const result = await this.bloggerUsersBanModel.updateOne(
      { id: banUserId, bloggerId: bloggerId, blogId: blogId },
      {
        'banInfo.isBanned': isBanned,
        'banInfo.banDate': banDate,
        'banInfo.banReason': banReason,
      },
    );
    return result.matchedCount === 1;
  }

  async deleteUsers(id: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Users"
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async deleteAllUsers() {
    await this.bloggerUsersBanModel.deleteMany();
    return this.dataSource.query(`DELETE FROM "Users"
	WHERE ${1} = '${1}';`);
  }
}
