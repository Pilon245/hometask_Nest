import { IsUrl, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { BlogOwnerInfoType } from './blogs.entity.dto';
import { BlogExistsRule } from '../../posts/guards/blog-id-validation.service';
import { UserExistsRule } from '../guards/blog-id-validation.service';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: BlogOwnerInfoType,
    public isBan: boolean,
  ) {}
}
export class CreateBlogInputDTO {
  // для валидации
  @Length(1, 15, { message: 'incorrect name' })
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
  blogOwnerInfo: BlogOwnerInfoType;
  isBan: boolean;
}
export class IdModelType {
  @Validate(BlogExistsRule)
  id: string;
  @Validate(UserExistsRule)
  userId: string;
}
