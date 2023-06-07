import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtGenerate } from '../helper/generate.token';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersSqlRepository } from '../../users/infrastructure/users.sql.repository';
import { UsersOrmRepository } from 'src/users/infrastructure/users.orm.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtGenerate: JwtGenerate,
    private configService: ConfigService,
    private usersRepository: UsersOrmRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // const user = await this.usersRepository.findUsersById(payload.id);
    // if (!user || user.banInfo.isBanned) throw new UnauthorizedException();
    //todo проврека если у пользователя сохранился тоекн после бана и он сможет дальше активничать
    return { id: payload.id };
  }
}
