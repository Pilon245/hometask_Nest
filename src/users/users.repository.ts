import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/users.entity';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from './entities/blogger.users.blogs.ban.entity';

@Injectable({ scope: Scope.DEFAULT })
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BloggerUsersBan.name)
    private bloggerUsersBanModel: Model<BloggerUsersBanDocument>,
  ) {}
  async findUsersById(id: string): Promise<User> {
    return this.userModel.findOne({ id }, { _id: false, __v: 0 });
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    return this.userModel.findOne({
      $or: [
        { 'accountData.login': LoginOrEmailL },
        { 'accountData.email': LoginOrEmailL },
      ],
    });
  }
  async findBanBloggerUsers(banUserId: string, blogId: string): Promise<User> {
    return this.bloggerUsersBanModel.findOne(
      { banUserId, blogId, 'banInfo.isBanned': true },
      { _id: false, __v: 0 },
    );
  }
  async findBanBloggerUsersDB(
    banUserId: string,
    blogId: string,
  ): Promise<User> {
    return this.bloggerUsersBanModel.findOne({
      $and: [{ id: banUserId }, { blogId }],
    });
  }
  async findLoginAndEmail(Login: string, Email: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ 'accountData.login': Login }, { 'accountData.email': Email }],
    });
    return user;
  }
  async updateEmailConfirmation(id: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }
  async updatePasswordConfirmation(id: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'passwordConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }
  async updateEmailCode(id: string, code: any) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'emailConfirmation.confirmationCode': code } },
    );
    return result.modifiedCount === 1;
  }
  async updatePasswordCode(id: string, code: any) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'passwordConfirmation.confirmationCode': code } },
    );
    return result.modifiedCount === 1;
  }
  async updatePasswordUsers(id: string, password: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'accountData.passwordHash': password } },
    );
    return result.modifiedCount === 1;
  }
  async findUserByConfirmationEmailCode(emailConfirmationCode: string) {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
  }
  async findUserByConfirmationPasswordCode(passwordConfirmation: string) {
    return this.userModel.findOne({
      'passwordConfirmation.confirmationCode': passwordConfirmation,
    });
  }
  async createUsers(user: any) {
    const users = await new this.userModel(user);
    return users.save();
  }
  async banBloggerUsers(user: any) {
    const banUsers = await new this.bloggerUsersBanModel(user);
    return banUsers.save();
  }
  async updateUsers(model: any) {
    const result = await this.userModel.updateOne(
      { id: model.id },
      {
        'banInfo.isBanned': model.isBanned,
        'banInfo.banDate': model.banDate,
        'banInfo.banReason': model.banReason,
      },
    );
    return result.matchedCount === 1;
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
  // async unbanBloggerUsers(banUserId: string, bloggerId: string) {
  //   const result = await this.bloggerUsersBanModel.deleteOne({
  //     banUserId,
  //     bloggerId,
  //   });
  //   return result.deletedCount === 1;
  // }
  async deleteUsers(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async deleteAllUsers() {
    await this.bloggerUsersBanModel.deleteMany();
    return this.userModel.deleteMany();
  }
}
