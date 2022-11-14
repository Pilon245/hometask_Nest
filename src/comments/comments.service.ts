import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { CreateCommentsDto, LikeValue } from './dto/create.comments.dto';
//todo сылки на гит как удалить
@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment = new CreateCommentsDto(
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
    const createdComment = await this.commentsRepository.createComments(
      newComment,
    );
    // const outCreateComment = {
    //   id: createdComment.id,
    //   content: createdComment.content,
    //   userId: createdComment.userId,
    //   userLogin: createdComment.userLogin,
    //   createdAt: createdComment.createdAt,
    //   likesInfo: {
    //     dislikesCount: 0,
    //     likesCount: 0,
    //     myStatus: LikeValue.none,
    //   },
    // };
    return createdComment;
  }
  async updateComment(id: string, content: string) {
    return await this.commentsRepository.updateComment(id, content);
  }
  async updateLike(userId: string, commentId: string, value: LikeValue) {
    const user = await this.commentsRepository.findLikeByIdAndCommentId(
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
        return await this.commentsRepository.createLike(newLike);
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
