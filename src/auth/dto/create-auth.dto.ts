// export class LoginInputModel {
//   constructor(public login: string, public password: string) {}
// }
import { Length } from 'class-validator';

export class LoginInputModel {
  @Length(0)
  loginOrEmail: string;
  @Length(0)
  password: string;
}
