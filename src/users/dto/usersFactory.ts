import { Prop } from '@nestjs/mongoose';
import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.dto';
import { Length, Matches } from 'class-validator';

export class CreateUserInputModel {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
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
