import { Prop } from '@nestjs/mongoose';
import {
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.dto';
import { Length } from 'class-validator';

export class CreateUserInputModel {
  @Length(0)
  login: string;
  @Length(0)
  password: string;
  @Length(0)
  email: string;
}

export class CreateFactory {
  constructor(
    public id: string,
    public accountData: UsersAccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordConfirmation: PasswordConfirmationType,
  ) {}
}
