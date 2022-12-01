import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { LikeValuePost } from './entities/likes.posts.entity';
import { newestLikesType } from './entities/posts.entity';
import {
  CreatePostInputDTO,
  LikesPostFactory,
  PostsFactory,
} from './dto/postsFactory';
import { UpdatePostDTO } from './dto/update.posts.dto';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async createPosts(inputModel: CreatePostInputDTO) {
    const blog = await this.blogsQueryRepository.findBlogById(
      inputModel.blogId,
    );
    const newPost = new PostsFactory(
      String(+new Date()),
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
      inputModel.blogId,
      blog.name,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeValuePost.none,
        newestLikes: [],
      },
    );
    return this.postsRepository.createPosts(newPost);
  }
  updatePosts(id: string, model: CreatePostInputDTO) {
    const updatePost: UpdatePostDTO = {
      id: id,
      title: model.title,
      shortDescription: model.shortDescription,
      content: model.content,
      blogId: model.blogId,
    };
    return this.postsRepository.updatePosts(updatePost);
  }
  async updateLike(
    userId: string,
    postId: string,
    value: LikeValuePost,
    login: string,
  ) {
    const user = await this.postsRepository.findLikeByIdAndPostId(
      userId,
      postId,
    );
    if (!user) {
      if (value === LikeValuePost.like) {
        const newLike = new LikesPostFactory(
          1,
          0,
          value,
          userId,
          postId,
          login,
          new Date().toISOString(),
        );
        return await this.postsRepository.createLike(newLike);
      }
      if (value === LikeValuePost.dislike) {
        const newLike = new LikesPostFactory(
          0,
          1,
          value,
          userId,
          postId,
          login,
          new Date().toISOString(),
        );
        return await this.postsRepository.createLike(newLike);
      }
      if (value === LikeValuePost.none) {
        const newLike = new LikesPostFactory(
          0,
          0,
          value,
          userId,
          postId,
          login,
          new Date().toISOString(),
        );
        return await this.postsRepository.createLike(newLike);
      }
    }
    if (value === LikeValuePost.like && user.likesStatus === 0) {
      const likesStatus = 1;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const post = postId;
      const loginUser = login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }
    if (value === LikeValuePost.dislike && user.dislikesStatus === 0) {
      console.log('value22', value);
      const likesStatus = 0;
      const dislikesStatus = 1;
      const myStatus = value;
      const authUserId = userId;
      const post = postId;
      const loginUser = login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }

    if (value === LikeValuePost.none) {
      const likesStatus = 0;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const post = postId;
      const loginUser = login;
      const addedAt = new Date().toISOString();

      return await this.postsRepository.updateLike(
        authUserId,
        post,
        likesStatus,
        dislikesStatus,
        myStatus,
        loginUser,
        addedAt,
      );
    }
    return false;
  }
  deletePosts(id: string) {
    return this.postsRepository.deletePosts(id);
  }
  async deleteAllPost() {
    return this.postsRepository.deleteAllPost();
  }
}

export class extendedLikesInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValuePost;
  newestLikes: Array<newestLikesType>;
}
