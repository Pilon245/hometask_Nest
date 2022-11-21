import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateBlogInputModelType {
  @IsOptional()
  id: string;

  @Length(0, 15, { message: 'incorrect name' })
  name: string;

  @Length(0, 500)
  description: string;

  @Length(0, 100)
  @IsUrl()
  websiteUrl: string;
}
