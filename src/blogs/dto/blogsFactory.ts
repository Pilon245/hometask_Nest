import { IsOptional, IsUrl, Length } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public youtubeUrl: string,
    public createdAt: string,
  ) {}
}
export class CreateBlogInputDTO {
  // для валидации

  @IsOptional()
  id: string;

  @Length(0, 100, { message: 'incorrect name' })
  name: string;

  @Length(0, 100)
  @IsUrl()
  youtubeUrl: string;

  @IsOptional()
  createdAt: string;
}
