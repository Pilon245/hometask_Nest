import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.dto';
import { IsBoolean, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { UsersQueryRepository } from '../users.query.repository';

export class CreateUserInputModel {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  login: string;
  @Length(6, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}

export class BanUserInputModel {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
}

export class UsersFactory {
  constructor(
    public id: string,
    public accountData: UsersAccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordConfirmation: PasswordConfirmationType,
    public banInfo: BanInfoType,
  ) {}
}
export class BanUsersFactory {
  constructor(
    public id: string,
    public isBanned: boolean,
    public banDate: string,
    public banReason: string,
  ) {}
}
