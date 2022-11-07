import { Injectable } from '@nestjs/common';
import {
  CreatePostInputModelType,
  PostOutputModelType,
  UpdatePostInputModelType,
} from './posts.controller';
import { PostsRepository } from './posts.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BlogOutputModelType } from '../blogs/blogs.controller';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogRepostirory: BlogsRepository,
  ) {}
  findPosts() {
    return this.postsRepository.findPosts();
  }
  findPostById(id: string) {
    return this.postsRepository.findPostById(id);
  }
  findPostByBlogId(blogId: string) {
    return this.postsRepository.findPostByBlogId(blogId);
  }
  createPosts(inputModel: CreatePostInputModelType) {
    // const blog: BlogOutputModelType = this.blogRepostirory.findBlogById(
    //   inputModel.blogId,
    // );
    // if (!blog) return false;
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
  deleteAllPosts() {
    return this.postsRepository.deleteAllPosts();
  }
}
