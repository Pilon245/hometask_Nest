import { IsBoolean, IsUrl, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BanBlogsInfoType, BlogOwnerInfoType } from './blogs.entity.dto';
import { BlogExistsRule } from '../../../posts/guards/blog-id-validation.service';
import { UserExistsRule } from '../../guards/blog-id-validation.service';
import { ApiProperty } from '@nestjs/swagger';

export class BlogsFactory {
  // для созадния обЪекта
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
    public blogOwnerInfo: BlogOwnerInfoType,
    public banInfo: BanBlogsInfoType,
  ) {}
}

export class CreateBlogInputDTO {
  // для валидации
  @ApiProperty({
    description: 'name blog',
    minimum: 1,
    maximum: 15,
    type: String,
  })
  @Length(1, 15, { message: 'incorrect name' })
  @Transform(({ value }: TransformFnParams) => value?.trim()) //todo крашит когда отпраляешь намбер
  name: string;

  @ApiProperty({
    description: 'description blog',
    minimum: 1,
    maximum: 500,
    type: String,
  })
  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'websiteUrl blog',
    minimum: 1,
    maximum: 100,
    type: String,
  })
  @Length(1, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}

export class CreateBlogDTO {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  blogOwnerInfo: BlogOwnerInfoType;
  banInfo: BanBlogsInfoType;
}

export class IdModelType {
  @Validate(BlogExistsRule)
  id: string;
  @Validate(UserExistsRule)
  userId: string;
}

export class BanBlogsInputModel {
  @IsBoolean()
  isBanned: boolean;
}
