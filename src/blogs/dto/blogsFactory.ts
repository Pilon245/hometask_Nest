import { IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { BlogOwnerInfoType } from './blogs.entity.dto';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: BlogOwnerInfoType,
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
}
