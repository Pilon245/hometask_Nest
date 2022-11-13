import { Prop } from '@nestjs/mongoose';
import {
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.dto';

export class CreateUserInputModel {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {}
}

export class CreateUsersDto {
  constructor(
    public id: string,
    public accountData: UsersAccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordConfirmation: PasswordConfirmationType,
  ) {}
}
