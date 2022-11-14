import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}
  async findCommentById(id: string) {
    const comment = await commentsRepository.findCommentById(id);
    if (comment) {
      const outComment = {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
      };
      return outComment;
    }
    return comment;
  }
  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    // const newComment: CommentsDbType = {
    //     id: String(+new Date()),
    //     content: content,
    //     userId: userId,
    //     postId: postId,
    //     userLogin: userLogin,
    //     createdAt: new Date().toISOString(),
    //     likesInfo: {
    //         likesCount: 0,
    //         dislikesCount: 0,
    //         myStatus:  "None",
    //     }
    //
    // }
    const newComment = new CommentsDbType(
      String(+new Date()),
      content,
      userId,
      postId,
      userLogin,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeValue.none,
      },
    );
    const createdComment = await commentsRepository.createComment(newComment);
    const outCreateComment = {
      id: createdComment.id,
      content: createdComment.content,
      userId: createdComment.userId,
      userLogin: createdComment.userLogin,
      createdAt: createdComment.createdAt,
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: LikeValue.none,
      },
    };
    return outCreateComment;
  }
  async updateComment(id: string, content: string) {
    return await commentsRepository.updateComment(id, content);
  }
  async updateLike(userId: string, commentId: string, value: LikeValue) {
    const user = await commentsRepository.findLikeByIdAndCommentId(
      userId,
      commentId,
    );
    if (!user) {
      if (value === LikeValue.like) {
        const newLike: LikeCommentStatusDBType = {
          likesStatus: 1,
          dislikesStatus: 0,
          myStatus: value,
          authUserId: userId,
          commentId: commentId,
        };
        return await commentsRepository.createLike(newLike);
      }
      if (value === LikeValue.dislike) {
        const newLike: LikeCommentStatusDBType = {
          likesStatus: 0,
          dislikesStatus: 1,
          myStatus: value,
          authUserId: userId,
          commentId: commentId,
        };
        return await commentsRepository.createLike(newLike);
      }
      if (value === LikeValue.none) {
        const newLike: LikeCommentStatusDBType = {
          likesStatus: 0,
          dislikesStatus: 0,
          myStatus: value,
          authUserId: userId,
          commentId: commentId,
        };
        return await commentsRepository.createLike(newLike);
      }
    }
    if (value === LikeValue.like && user!.likesStatus === 0) {
      const likesStatus = 1;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (value === LikeValue.dislike && user!.dislikesStatus === 0) {
      const likesStatus = 0;
      const dislikesStatus = 1;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await commentsRepository.updateLike(
        authUserId,
        comment,
        likesStatus,
        dislikesStatus,
        myStatus,
      );
    }
    if (value === LikeValue.none) {
      const likesStatus = 0;
      const dislikesStatus = 0;
      const myStatus = value;
      const authUserId = userId;
      const comment = commentId;
      return await commentsRepository.updateLike(
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
    return await commentsRepository.deleteComment(id);
  }
  async deleteAllComment() {
    return await commentsRepository.deleteAllComment();
  }
}
