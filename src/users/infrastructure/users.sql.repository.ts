import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/entities/nosql/users.entity';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/nosql/blogger.users.blogs.ban.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BanBloggerUsersFactory } from '../domain/dto/usersFactory';

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

  async findUsersById(id: string): Promise<any> {
    const users = await this.dataSource.query(
      `${this.select}
        WHERE "id" = '${id}' `,
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
        confirmationCode: users[0].emailconfirmationCode,
        expirationDate: users[0].emailexpirationDate,
        isConfirmed: users[0].emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passconfirmationcode,
        expirationDate: users[0].passexpirationDate,
        isConfirmed: users[0].passisconfirmed,
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
        confirmationCode: users[0].emailconfirmationcode,
        expirationDate: users[0].emailexpirationdate,
        isConfirmed: users[0].emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passconfirmationcode,
        expirationDate: users[0].passexpirationdate,
        isConfirmed: users[0].passisconfirmed,
      },
      banInfo: {
        isBanned: users[0].isBanned,
        banDate: users[0].banDate,
        banReason: users[0].banReason,
      },
    };
  }

  async findBanBloggerUsersDB(banUserId: string, blogId: string) {
    const banUser = await this.dataSource.query(
      `SELECT * FROM "BloggerUsersBan"
                WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}'`,
    );
    if (!banUser[0]) return false;
    return true;
  }
  async updateEmailConfirmation(id: string) {
    const result = await this.dataSource.query(
      `UPDATE "EmailConfirmation"
	SET "isConfirmed"=True
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordConfirmation(id: string) {
    const result = await this.dataSource.query(
      `UPDATE "PasswordConfirmation"
	SET "isConfirmed"=True
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updateEmailCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "EmailConfirmation"
	SET "confirmationCode"='${code}'
	WHERE "userId" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "PasswordConfirmation"
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
        confirmationCode: users[0].emailconfirmationCode,
        expirationDate: users[0].emailexpirationDate,
        isConfirmed: users[0].emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passconfirmationcode,
        expirationDate: users[0].passexpirationDate,
        isConfirmed: users[0].passisconfirmed,
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
        confirmationCode: users[0].emailconfirmationCode,
        expirationDate: users[0].emailexpirationDate,
        isConfirmed: users[0].emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users[0].passconfirmationcode,
        expirationDate: users[0].passexpirationDate,
        isConfirmed: users[0].passisconfirmed,
      },
      banInfo: {
        isBanned: users[0].isBanned,
        banDate: users[0].banDate,
        banReason: users[0].banReason,
      },
    };
  }

  async createUsers(user: any) {
    await this.dataSource.query(`
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
    "userId", "isBanned")
    VALUES ('${user.id}', '${user.banInfo.isBanned}');`);

    return;
  }

  async banBloggerUsers(user: BanBloggerUsersFactory) {
    if (user.banInfo.isBanned) {
      await this.dataSource.query(`INSERT INTO "BloggerUsersBan"(
	"blogId", "userId", "isBanned", "banDate", "banReason")
    VALUES ('${user.blogId}', '${user.id}', '${user.banInfo.isBanned}'
    , '${user.banInfo.banDate}', '${user.banInfo.banReason}');`);
    } else {
      await this.dataSource.query(`INSERT INTO "BloggerUsersBan"(
	"blogId", "userId", "isBanned", "banDate", "banReason")
    VALUES ('${user.blogId}', '${user.id}', '${user.banInfo.isBanned}'
    , null, null);`);
    }
    return true;
  }

  async updateUsers(model: any) {
    if (model.isBanned) {
      await this.dataSource.query(
        `UPDATE "UsersBanInfo"
	SET "isBanned"='${model.isBanned}', "banDate" = '${model.banDate}',
	 "banReason" = '${model.banReason}'
	WHERE "userId" = '${model.id}';`,
      );
    } else {
      await this.dataSource.query(
        `UPDATE "UsersBanInfo"
    SET "isBanned"='${model.isBanned}', "banDate" = ${model.banDate},
     "banReason" = ${model.banReason}
    WHERE "userId" = '${model.id}';`,
      );
    }
    return true;
  }

  async updateBanBloggerUsers(
    banUserId: string,
    bloggerId: string,
    blogId: string,
    isBanned: boolean,
    banDate: string,
    banReason: string,
  ) {
    // if (isBanned) {
    await this.dataSource.query(
      `UPDATE "BloggerUsersBan"
	SET "isBanned"='${isBanned}', "banDate" = '${banDate}',
	 "banReason" = '${banReason}'
	WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}';`,
    );
    // } else {
    //   await this.dataSource.query(
    //     `UPDATE "BloggerUsersBan"
    // SET "isBanned"='${isBanned}', "banDate" = null,
    //  "banReason" = null
    // WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}';`,
    //   );
    // }
    return true;
  }

  async deleteUsers(id: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Users"
	          WHERE "id" = '${id}';`,
    );
    if (!result[1]) return false;
    return true;
  }

  async deleteAllUsers() {
    await this.dataSource.query(`DELETE FROM "BloggerUsersBan"`);
    return this.dataSource.query(`DELETE FROM "Users"`);
  }
}
