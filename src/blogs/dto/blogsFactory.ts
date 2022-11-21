import { IsUrl, Length } from 'class-validator';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}
export class CreateBlogInputDTO {
  // для валидации

  @Length(0, 15, { message: 'incorrect name' })
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @IsUrl()
  websiteUrl: string;
}
export class CreateBlogDTO {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
