import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  /*ErrorExceptionFilter,*/ HttpExceptionFilter,
} from './exception.filters';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // somewhere in your initialization file
  app.use(cookieParser());
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true, //todo прочитать по это
      // whitelist: true,
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
}
bootstrap();
