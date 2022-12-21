export class BlogsDBType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: BlogOwnerInfoType,
    public isBan: boolean,
  ) {}
}
export class BlogOwnerInfoType {
  constructor(public userId: string, public userLogin: string) {}
}

export class BanBlogsInfoType {
  constructor(public isBanned: boolean, public banDate: string) {}
}
