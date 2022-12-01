import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.dto';
import { Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

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

export class UsersFactory {
  constructor(
    public id: string,
    public accountData: UsersAccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordConfirmation: PasswordConfirmationType,
    public banInfo: BanInfoType,
  ) {}
}
