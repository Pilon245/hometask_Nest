export class CreateBlogsDto {
  constructor(
    public id: string,
    public name: string,
    public youtubeUrl: string,
    public createdAt: string,
  ) {}
}
