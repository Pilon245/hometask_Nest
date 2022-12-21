export class BlogOwnerInfoType {
  constructor(public userId: string, public userLogin: string) {}
}

export class BanBlogsInfoType {
  constructor(public isBanned: boolean, public banDate: string) {}
}
