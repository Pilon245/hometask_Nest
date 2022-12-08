import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from '../dto/entity.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ id: false })
export class UsersAccountData {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  createdAt: string;
}

const UsersAccountDataSchema = SchemaFactory.createForClass(UsersAccountData);

@Schema({ id: false })
export class UsersEmailConfirmationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

const UsersEmailConfirmationDataSchema = SchemaFactory.createForClass(
  UsersEmailConfirmationData,
);

@Schema({ id: false })
export class UsersPasswordConfirmationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

const UsersPasswordConfirmationDataSchema = SchemaFactory.createForClass(
  UsersPasswordConfirmationData,
);

@Schema({ id: false })
export class UsersBanInfoTypeData {
  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ required: true })
  banDate: string;

  @Prop({ required: true })
  banReason: string;
}

const UsersBanInfoTypeDataSchema =
  SchemaFactory.createForClass(UsersBanInfoTypeData);

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ type: UsersAccountDataSchema })
  accountData: UsersAccountDataType;

  @Prop({ type: UsersEmailConfirmationDataSchema })
  emailConfirmation: EmailConfirmationType;

  @Prop({ type: UsersPasswordConfirmationDataSchema })
  passwordConfirmation: PasswordConfirmationType;

  @Prop({ type: UsersBanInfoTypeDataSchema })
  banInfo: BanInfoType;
}

export const UserSchema = SchemaFactory.createForClass(User);
