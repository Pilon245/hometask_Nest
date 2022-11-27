import { Injectable } from '@nestjs/common';
import { Blog } from '../blogs/blog.entity';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/entities/posts.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // private cfgSer: ConfigService,
  ) {}
  async findUserById(id: string) {
    const result = await this.userModel.findOne({ id: id });
    return result;
  }
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    //todo где это надо писать , если используется в сервисе
    const user = await this.userModel.findOne({
      $or: [
        { 'accountData.login': LoginOrEmailL },
        { 'accountData.email': LoginOrEmailL },
      ],
    });
    return user;
  }
  async findLoginAndEmail(Login: string, Email: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ 'accountData.login': Login }, { 'accountData.email': Email }],
    });
    return user;
  }
  async findLogin(Login: string): Promise<User> {
    const user = await this.userModel.findOne({ 'accountData.login': Login });
    return user;
  }
  async findEmail(Email: string): Promise<User> {
    const user = await this.userModel.findOne({ 'accountData.email': Email });
    return user;
  }
  // async findTokenByUserIdAndDeviceId(userId: string, deviceId: string) {
  //   const result = await TokenModelClass.findOne({
  //     $and: [{ userId: userId }, { deviceId: deviceId }],
  //   });
  //   return result;
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
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
    return user;
  }
  async findUserByConfirmationPasswordCode(passwordConfirmation: string) {
    const user = await this.userModel.findOne({
      'passwordConfirmation.confirmationCode': passwordConfirmation,
    });
    return user;
  }
  async createUsers(user: any) {
    const users = await new this.userModel(user);
    return users.save();
  }
  async deleteUsers(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllUsers() {
    const result = await this.userModel.deleteMany();
    return result;
  }
}
