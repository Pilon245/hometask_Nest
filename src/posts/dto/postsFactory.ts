import { IsOptional, IsUrl, Length } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { extendedLikesInfoType } from '../posts.service';
import { LikeValuePost } from '../entities/likes.posts.entity';
import { Transform, TransformFnParams } from 'class-transformer';

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
  @Length(0, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;
  @Length(0, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(0, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
  @Length(0)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  blogId: string;
}
export class CreatePostByBlogIdInputDTO {
  @Length(0, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;
  @Length(0, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(0, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
  @IsOptional()
  @Length(0)
  blogId: string;
}

export class LikesPostFactory {
  constructor(
    public likesStatus: number,
    public dislikesStatus: number,
    public myStatus: LikeValuePost,
    public userId: string,
    public postId: string,
    public login: string,
    public addedAt: string,
  ) {}
}

export class CreateLikeInputDTO {
  likesStatus: number;
  dislikesStatus: number;
  myStatus: LikeValuePost;
  userId: string;
  postId: string;
  login: string;
  addedAt: string;
}
