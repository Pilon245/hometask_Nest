import { LikeValueComment } from '../entities/likes.comments.entity';

export class CreateFactory {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public postId: string,
    public userLogin: string,
    public createdAt: string,
    public likesInfo: LikeInfoType,
  ) {}
}
export class LikeInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValueComment;
}
export class CreateLikeInputDTO {
  likesStatus: number;
  dislikesStatus: number;
  myStatus: LikeValueComment;
  authUserId: string;
  commentId: string;
}
