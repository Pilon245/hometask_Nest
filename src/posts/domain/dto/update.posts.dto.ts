import { Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdatePostBloggerInputModelType {
  @Length(1, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
}
export type UpdatePostDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type UpdatePostUseCaseDTO = {
  postId: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type UpdateLikePostUseCaseDTO = {
  userId: string;
  postId: string;
  value: string;
  login: string;
};
