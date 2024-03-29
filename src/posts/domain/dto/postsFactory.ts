import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Validate,
} from 'class-validator';
import { LikeValuePost } from '../entities/nosql/likes.posts.entity';
import { Transform, TransformFnParams } from 'class-transformer';
import { BlogExistsRule } from '../../guards/blog-id-validation.service';

export class PostsFactory {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public isBanned: boolean,
    public userId: string,
  ) {}
}
export class CreatePostRepo {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  isBanned: boolean;
  userId: string;
}
export class CreatePostUseCaseDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  userId: string;
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
  @Validate(BlogExistsRule)
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
    public isBanned: boolean,
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
