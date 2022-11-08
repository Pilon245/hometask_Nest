import { Injectable } from '@nestjs/common';
import {
  CreatePostInputModelType,
  PostOutputModelType,
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
  createPosts(inputModel: CreatePostInputModelType) {
    const blog = this.blogsQueryRepository.findBlogById(inputModel.blogId);
    if (!blog) return false;
    const newPost: PostOutputModelType = {
      id: String(+new Date()),
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
      blogName: 'blog.name',
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
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
