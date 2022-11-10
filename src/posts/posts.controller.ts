import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { pagination } from '../blogs/blogs.controller';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  getPosts(@Query() query) {
    return this.postsQueryRepository.findPosts(pagination(query));
  }
  @Get(':id')
  async getPost(@Param('id') id: string) {
    const resultFound = await this.postsQueryRepository.findPostById(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsQueryRepository.findPostById(id);
  }
  @Get(':postId/comments')
  async getCommentOnPostId(@Param('postId') postId: string) {
    const resultFound = await this.commentsQueryRepository.findCommentByPostId(
      postId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.commentsQueryRepository.findCommentByPostId(postId);
  }
  @Post()
  createPosts(@Body() inputModel: CreatePostInputModelType) {
    return this.postsService.createPosts(inputModel);
  }
  @Put(':id')
  @HttpCode(204)
  async updatePosts(
    @Param('id') postId: string,
    @Body() model: UpdatePostInputModelType,
  ) {
    const resultFound = await this.postsQueryRepository.findPostById(postId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    return this.postsService.updatePosts(postId, model);
  }
  @Delete(':id')
  @HttpCode(204)
  async deletePosts(@Param('id') postId: string) {
    const resultFound = await this.postsQueryRepository.findPostById(postId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    const result = this.postsService.deletePosts(postId);
    return result;
  }
}

export type CreatePostInputModelType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostOutputModelType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Array<any>;
  };
  // newestLikes: [
  //   {
  //     addedAt: "2022-11-07T11:31:23.905Z",
  //     userId: "string",
  //     login: "string"
  //   }
  // ]
};

export type UpdatePostInputModelType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
//todo  при удаление блога , все посты не должны удалятся?
//todo .gitignore .env
// todo exec асинк, для чего?
//todo  как принимать квери
//todo async await в контроллерах нестджс
