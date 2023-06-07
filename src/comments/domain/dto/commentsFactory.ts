import { LikeValueComment } from '../entities/nosql/likes.comments.entity';

export class CommentsFactory {
  constructor(
    public id: string,
    public content: string,
    public postId: string,
    public createdAt: string,
    public commentatorInfo: CommentatorInfoType,
    public postInfo: postInfoType,
    public ownerUserId: string,
    public isBanned: boolean,
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
  isBanned: boolean;
}

export class LikesFactory {
  constructor(
    public likesStatus: number,
    public dislikesStatus: number,
    public myStatus: LikeValueComment,
    public userId: string,
    public commentId: string,
    public isBanned: boolean,
  ) {}
}

export class CreateCommentUseCaseDto {
  content: string;
  userId: string;
  postId: string;
  userLogin: string;
  title: string;
  blogId: string;
  blogName: string;
  ownerUserId: string;
}
export class UpdateCommentUseCaseDto {
  id: string;
  content: string;
}
