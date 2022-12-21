import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail', passReqToCallback: true }); //опиция повзовляет работать с реквестом
  }
  async validate(req, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
