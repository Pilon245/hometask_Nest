import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputModel {
  @ApiProperty()
  @Length(0)
  loginOrEmail: string;
  @ApiProperty()
  @Length(0)
  password: string;
}
