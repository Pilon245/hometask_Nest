import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    if (
      this.configService.get<string>('BASIC_USER') === username &&
      this.configService.get<string>('BASIC_PASS') === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
