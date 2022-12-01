import {
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  NotContains,
} from 'class-validator';
import { Trim } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}
export class CreateBlogInputDTO {
  // для валидации
  // @IsNotEmpty({
  //   message:
  //     {
  //       message: 'Email already exists',
  //       field: 'email',
  //     },
  //   ,
  // })
  @Length(1, 15, { message: 'incorrect name' })
  // @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim()) //todo крашит когда отпраляешь намбер
  name: string;

  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;
  @Length(1, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}
export class CreateBlogDTO {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
