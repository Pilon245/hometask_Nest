import { IsOptional, IsUrl, Length } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { extendedLikesInfoType } from '../posts.service';

export class PostsFactory {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo?: extendedLikesInfoType,
  ) {}
}
export class CreatePostInputDTO {
  @IsOptional()
  id: string;
  @Length(0, 30)
  title: string;
  @Length(0, 100)
  shortDescription: string;
  @Length(0, 1000)
  content: string;
  @Length(0)
  blogId: string;
  @IsOptional()
  blogName: string;
  @IsOptional()
  createdAt: string;
  @IsOptional()
  extendedLikesInfo?: extendedLikesInfoType;
}
export class CreatePostByBlogIdInputDTO {
  @IsOptional()
  id: string;
  @Length(0, 30)
  title: string;
  @Length(0, 100)
  shortDescription: string;
  @Length(0, 1000)
  content: string;
  @IsOptional()
  @Length(0)
  blogId: string;
  @IsOptional()
  blogName: string;
  @IsOptional()
  createdAt: string;
  @IsOptional()
  extendedLikesInfo?: extendedLikesInfoType;
}