import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { extendedLikesInfoType } from '../posts.service';
import { LikeValuePost } from '../entities/likes.posts.entity';
import { Transform, TransformFnParams } from 'class-transformer';
import { LikeValueComment } from '../../comments/entities/likes.comments.entity';

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
  @Length(1, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
  @Length(1)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  blogId: string;
}
export class CreatePostByBlogIdInputDTO {
  @Length(1, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
  @IsOptional()
  @Length(1)
  blogId: string;
}

export class UpdatePostLikeInputModel {
  @IsNotEmpty()
  @IsEnum(LikeValuePost)
  // @Transform(({ value }: TransformFnParams) => value?.trim())
  // @Length(1, 7) //todo седать валидацию лайков
  likeStatus: LikeValuePost;
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
