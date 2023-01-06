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

  async findUsersById(id: string): Promise<User> {
    const result = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "id" = '${id}' `,
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
      `UPDATE "Users"
	SET "emailIsConfirmed"=True
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordConfirmation(id: string) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "passIsConfirmed"=True
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async updateEmailCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "emailConfirmationCode"='${code}'
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async updatePasswordCode(id: string, code: any) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "passConfirmationCode"='${code}'
	WHERE "id" = '${id}';`,
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
    const result = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "emailConfirmationCode" = '${emailConfirmationCode}' `,
    );
    return result[0];
  }

  async findUserByConfirmationPasswordCode(passwordConfirmation: string) {
    const result = await this.dataSource.query(
      `SELECT * FROM "Users" 
        WHERE "passConfirmationCode" = '${passwordConfirmation}' `,
    );
    return result[0];
  }

  async createUsers(user: any) {
    const users = await this.dataSource.query(`INSERT INTO "Users"(
"id", "login", "email", "passwordHash", "createdAt", "emailConfirmationCode", "emailExpirationDate",
 "emailIsConfirmed", "passConfirmationCode", "passExpirationDate", "passIsConfirmed", 
 "isBanned", "banDate", "banReason")
    VALUES('${user.id}', '${user.accountData.login}', '${user.accountData.email}',
     '${user.accountData.passwordHash}',
      '${user.accountData.createdAt}', '${user.emailConfirmation.confirmationCode}',
      '${user.emailConfirmation.expirationDate}', '${user.emailConfirmation.isConfirmed}', 
      '${user.passwordConfirmation.confirmationCode}','${user.passwordConfirmation.expirationDate}', 
      '${user.passwordConfirmation.isConfirmed}',
       '${user.banInfo.isBanned}','${user.banInfo.banDate}', '${user.banInfo.banReason}');`);

    return;
  }

  async banBloggerUsers(user: any) {
    const banUsers = await new this.bloggerUsersBanModel(user);
    return banUsers.save();
  }

  async updateUsers(model: any) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "isBanned"='${model.isBanned}', "banDate" = '${model.banDate}',
	 "banReason" = '${model.banReason}'
	WHERE "id" = '${model.id}';`,
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
    return this.userModel.deleteMany();
  }
}
