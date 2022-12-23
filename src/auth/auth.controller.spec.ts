// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './api/auth.controller';
// import { AuthService } from './application/auth.service';
// import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
// import { SessionModule } from '../session/session.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../users/domain/entities/users.entity';
// import {
//   BloggerUsersBan,
//   BloggerUsersBanSchema,
// } from '../users/domain/entities/blogger.users.blogs.ban.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { ThrottlerModule } from '@nestjs/throttler';
// import { CqrsModule } from '@nestjs/cqrs';
// import { AuthModule } from './auth.module';
// import { ConfigService } from '@nestjs/config';
// import { AppModule } from '../app.module';
// import request from 'supertest';
//
// describe('AuthController', () => {
//   let controller: AuthController;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         AppModule,
//         // PassportModule,
//         // UsersModule,
//         // SessionModule,
//         // MongooseModule.forFeature([
//         //   { name: User.name, schema: UserSchema },
//         //   { name: BloggerUsersBan.name, schema: BloggerUsersBanSchema },
//         // ]),
//         // JwtModule.register({
//         //   secret: new ConfigService().get<string>('ACCESS_JWT_SECRET'),
//         //   signOptions: { expiresIn: '7m' },
//         // }),
//         // ThrottlerModule.forRoot({
//         //   ttl: 10,
//         //   limit: 5,
//         // }),
//         // CqrsModule,
//       ],
//       controllers: [AuthController],
//       providers: [AuthService],
//     }).compile();
//
//     controller = module.get<AuthController>(AuthController);
//   });
//
//   it('should be defined', async () => {
//     expect(controller).toBeDefined();
//   });
//   it('should get a JWT then successfully make a call', async () => {
//     const template = 'admin:qwerty';
//     const base64Data = Buffer.from(template);
//     const base64String = base64Data.toString('base64');
//     const validAuthHeader = `Basic ${base64String}`;
//     console.log(validAuthHeader);
//     const userResponse1 = await request(app.getHttpServer())
//       .post('/sa/users')
//       .set({ authorization: validAuthHeader });
//     console.log(userResponse1.body);
//   });
// });
