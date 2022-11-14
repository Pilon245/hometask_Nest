export class CreateCommentsDto {
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
  //todo тут класс так можно писать? без конструктора
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeValue;
}

export enum LikeValue {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}
