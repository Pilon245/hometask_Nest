import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  /*ErrorExceptionFilter,*/ HttpExceptionFilter,
} from './exception.filters';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // somewhere in your initialization file
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      // transform: true, //"10" = 10
      exceptionFactory: (errors) => {
        const errorsForResponce = [];
        errors.forEach((e) => {
          const constrainsKeys = Object.keys(e.constraints);
          constrainsKeys.forEach((ckey) => {
            errorsForResponce.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponce);
      },
    }),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter() /*, new ErrorExceptionFilter()*/,
  );

  await app.listen(4000, () => {
    `Server start on port: ${4000}`;
  });
  console.log('process.env.mongo', process.env.MONGO_URI);
}
bootstrap();

//todo переделать 429 ошибку и  авторизацию
