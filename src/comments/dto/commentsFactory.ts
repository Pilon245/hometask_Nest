import { LikeValueComment } from '../entities/likes.comments.entity';

export class CommentsFactory {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public postId: string,
    public userLogin: string,
    public createdAt: string,
    public likesInfo: LikeInfoType,
    public commentatorInfo: commentatorInfoType,
    public postInfo: postInfoType,
    public isBan: boolean,
  ) {}
}
export class LikeInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValueComment;
}
export class commentatorInfoType {
  userId: string;
  userLogin: string;
}
export class postInfoType {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
}
export class CreateLikeInputDTO {
  likesStatus: number;
  dislikesStatus: number;
  myStatus: LikeValueComment;
  userId: string;
  commentId: string;
  isBan: boolean;
}

export class LikesFactory {
  constructor(
    public likesStatus: number,
    public dislikesStatus: number,
    public myStatus: LikeValueComment,
    public userId: string,
    public commentId: string,
    public isBan: boolean,
  ) {}
}
