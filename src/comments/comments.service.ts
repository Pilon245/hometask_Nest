import { Injectable, Scope } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentsFactory, LikesFactory } from './dto/commentsFactory';
import { LikeValueComment } from './entities/likes.comments.entity';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable({ scope: Scope.DEFAULT })
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}
  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string, //todo нужно использовать DTO
  ) {
    const post = await this.postsRepository.findPostById(postId);
    const banUser = await this.usersRepository.findBanBloggerUsers(
      userId,
      post.blogId,
    );
    if (banUser) return false;
    const newComment = new CommentsFactory(
      String(+new Date()),
      content,
      userId,
      postId,
      userLogin,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeValueComment.none,
      },
      {
        userId: userId,
        userLogin: userLogin,
      },
      {
        id: postId,
        title: post.title,
        blogId: post.blogId,
        blogName: post.blogName,
      },
      banUser.id,
      false,
    );
    console.log('newComment', newComment);
    return this.commentsRepository.createComments(newComment);
  }
  async updateComment(id: string, content: string) {
    return await this.commentsRepository.updateComment(id, content);
  }
  async updateLike(userId: string, commentId: string, value: LikeValueComment) {
    const user = await this.commentsRepository.findLikeByIdAndCommentId(
      userId,
      commentId,
    );
    if (!user) {
      if (value === LikeValueComment.like) {
        const newLike = new LikesFactory(1, 0, value, userId, commentId, false);
        return await this.commentsRepository.createLike(newLike);
      }
      if (value === LikeValueComment.dislike) {
        const newLike = new LikesFactory(0, 1, value, userId, commentId, false);
        return await this.commentsRepository.createLike(newLike);
      }
      if (value === LikeValueComment.none) {
        const newLike = new LikesFactory(0, 0, value, userId, commentId, false);
        return await this.commentsRepository.createLike(newLike);
      }
    }
    if (value === LikeValueComment.like && user.likesStatus === 0) {
      const likesStatus = 1;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (value === LikeValueComment.dislike && user.dislikesStatus === 0) {
      const likesStatus = 0;
      const dislikesStatus = 1;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (value === LikeValueComment.none) {
      const likesStatus = 0;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await this.commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    return false;
  }
  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id);
  }
  async deleteAllComment() {
    return this.commentsRepository.deleteAllComment();
  }
}
