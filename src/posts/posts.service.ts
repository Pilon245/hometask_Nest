import { Injectable } from '@nestjs/common';
import {
  CreatePostInputModelType,
  UpdatePostInputModelType,
} from './posts.controller';
import { PostsRepository } from './posts.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async createPosts(inputModel: CreatePostInputModelType) {
    const blog = await this.blogsQueryRepository.findBlogById(
      inputModel.blogId,
    );
    if (!blog) return false;
    const newPost = new CreatePostsDto(
      String(+new Date()),
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
      inputModel.blogId,
      blog.name,
      new Date().toISOString(),
      // {
      //   likesCount: 0,
      //   dislikesCount: 0,
      //   myStatus: 'None',
      //   newestLikes: [],
      // },
    );
    return this.postsRepository.createPosts(newPost);
  }
  updatePosts(id: string, model: CreatePostInputModelType) {
    const updatePost: UpdatePostInputModelType = {
      id: id,
      title: model.title,
      shortDescription: model.shortDescription,
      content: model.content,
      blogId: model.blogId,
    };
    return this.postsRepository.updatePosts(updatePost);
  }
  deletePosts(id: string) {
    return this.postsRepository.deletePosts(id);
  }
}

export class CreatePostsDto {
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

export type extendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: Array<any>;
  // newestLikes: [
  //   {
  //     addedAt: "2022-11-07T11:31:23.905Z",
  //     userId: "string",
  //     login: "string"
  //   }
  // ]
};
