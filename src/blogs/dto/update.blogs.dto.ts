import { IsOptional, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogOwnerInfoType } from './blogs.entity.dto';

export class UpdateBlogInputModelType {
  @ApiPropertyOptional()
  @IsOptional()
  id: string;

  @ApiProperty()
  @Length(1, 15, { message: 'incorrect name' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @ApiProperty()
  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty()
  @Length(1, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}
export class UpdateBlogOnNewUser {
  id: string;
  userId: string;
}

export class UpdateBlogOnNewUserRepo {
  id: string;
  userId: string;
  userLogin: string;
}

export class BanBlogsFactory {
  constructor(
    public id: string,
    public isBanned: boolean,
    public banDate: string,
  ) {}
}

export class BanBlogsRepo {
  id: string;
  isBanned: boolean;
  banDate: string;
}
