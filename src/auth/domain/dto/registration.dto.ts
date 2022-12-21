import { Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationInputModel {
  @ApiProperty()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  login: string;
  @ApiProperty()
  @Length(6, 20)
  password: string;
  @ApiProperty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class ConfirmationInputModel {
  @ApiProperty()
  @Length(0)
  code: string;
}

export class RegistrationEmailInputModel {
  @ApiProperty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class NewPasswordInputModel {
  @ApiProperty()
  @Length(6, 20)
  newPassword: string;
  @ApiProperty()
  @Length(0)
  recoveryCode: string;
}

export class RecoveryPasswordUserUseCaseDto {
  code: string;
  password: string;
}
