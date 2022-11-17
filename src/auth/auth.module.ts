// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UsersController } from '../users/users.controller';
// import { UsersRepository } from '../users/users.repository';
// import { UsersService } from '../users/users.service';
// import { UsersQueryRepository } from '../users/users.query.repository';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
//
// @Module({
//   imports: [
//     PassportModule,
//
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '7m' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, UsersQueryRepository],
// })
// export class AuthModule {}

//MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
