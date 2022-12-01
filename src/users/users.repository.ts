import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findLoginOrEmail(LoginOrEmailL: string): Promise<User> {
    return this.userModel.findOne({
      $or: [
        { 'accountData.login': LoginOrEmailL },
        { 'accountData.email': LoginOrEmailL },
      ],
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
  async deleteUsers(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAllUsers() {
    return this.userModel.deleteMany();
  }
}
