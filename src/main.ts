import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  /*ErrorExceptionFilter,*/ HttpExceptionFilter,
} from './exception.filters';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Pool } from 'pg';

const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  password: '1234',
  port: 5432,
};

const createDatabase = async () => {
  const pool = new Pool(pgConfig);
  const client = await pool.connect();

  try {
    // Создание базы данных
    await client.query('CREATE DATABASE "network"');
    console.log('База данных создана успешно');
  } catch (error) {
    console.error('Ошибка при создании базы данных');
  } finally {
    client.release();
    pool.end();
  }
};

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

  const config = new DocumentBuilder()
    .setTitle('Network project API-V1')
    .setDescription('The Network API description')
    .setVersion('v1.0')
    .addBearerAuth()
    .addBasicAuth()
    .addCookieAuth()
    .addTag('Network')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(4000, () => {
    console.log(`Server start on port: ${4000}`);
  });

  createDatabase();
}

bootstrap();
