import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({ usernameField: 'loginOrEmail', passReqToCallback: true });
  }
  // const port = this.configService.get('PORT');
  // return await this.userModel.find({}, { _id: false, __v: 0 }).exec();
  async validate(req, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    return user;
    // console.log('user', user);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
} //sdfsd