import { Length, Matches } from 'class-validator';

export class RegistrationInputModel {
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class ConfirmationInputModel {
  @Length(0)
  code: string;
}
export class RegistrationEmailInputModel {
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
export class NewPasswordInputModel {
  @Length(6, 20)
  newPassword: string;
  @Length(0)
  recoveryCode: string;
}
