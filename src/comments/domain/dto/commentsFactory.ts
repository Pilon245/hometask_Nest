import { LikeValueComment } from '../entities/likes.comments.entity';

export class CommentsFactory {
  constructor(
    public id: string,
    public content: string,
    public postId: string,
    public createdAt: string,
    // public likesInfo: LikeInfoType,
    public commentatorInfo: CommentatorInfoType,
    public postInfo: postInfoType,
    public ownerUserId: string,
    public isBan: boolean,
  ) {}
}
export class LikeInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValueComment;
}
export class CommentatorInfoType {
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

export class CreateCommentUseCaseDto {
  content: string;
  userId: string;
  postId: string;
  userLogin: string;
}
export class UpdateCommentUseCaseDto {
  id: string;
  content: string;
}
