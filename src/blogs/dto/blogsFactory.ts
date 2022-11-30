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
  @Length(1, 15, { message: 'incorrect name' })
  @NotContains(' ')
  // @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim()) //todo крашит когда отпраляешь намбер
  name: string;

  @Length(1, 500)
  @NotContains(' ')
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;
  @Length(1, 100)
  @IsUrl()
  @NotContains(' ')
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
