import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({ passReqToCallback: true });
  }
  async validate(req, username: string, pw: string): Promise<any> {
    console.log('BasicStrategy');
    const auth = req.headers.authorization;
    if (!auth) throw new UnauthorizedException();
    const authType = auth.split(' ')[0];
    if (authType !== 'Basic') throw new UnauthorizedException();
    const authPayload = auth.split(' ')[1];
    if (authPayload !== 'YWRtaW46cXdlcnR5') throw new UnauthorizedException();
    return;
  }
}
