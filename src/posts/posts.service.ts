import { Injectable } from '@nestjs/common';
import { UpdatePostInputModelType } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { LikeValuePost } from './entities/likes.posts.entity';
import { newestLikesType } from './entities/posts.entity';
import { CreatePostInputDTO, PostsFactory } from './dto/postsFactory';

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
    if (!blog) return false;
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
    // const found = await this.postsRepository.createPosts(newPost);
    // return {
    //   ...found,
    //   extendedLikesInfo: {
    //     likesCount: 0,
    //     dislikesCount: 0,
    //     myStatus: LikeValuePost.none,
    //     newestLikes: [],
    //   },
    // };
  }
  updatePosts(id: string, model: CreatePostInputDTO) {
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

export class extendedLikesInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValuePost;
  newestLikes: Array<newestLikesType>;
  // newestLikes: [
  //   {
  //     addedAt: "2022-11-07T11:31:23.905Z",
  //     userId: "string",
  //     login: "string"
  //   }
  // ]
}
