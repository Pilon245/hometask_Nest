import { IsOptional, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateBlogInputModelType {
  @IsOptional()
  id: string;

  @Length(1, 15, { message: 'incorrect name' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @Length(1, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}
