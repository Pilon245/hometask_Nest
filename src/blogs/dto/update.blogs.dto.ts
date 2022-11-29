import { IsOptional, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateBlogInputModelType {
  @IsOptional()
  id: string;

  @Length(0, 15, { message: 'incorrect name' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @Length(0, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @Length(0, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}
