import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsSqlQueryRepository } from '../../blogs/infrastructure/blogs.sql.query.repository';

@ValidatorConstraint({ name: 'BloggerExists', async: true })
@Injectable()
export class BloggerExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsSqlQueryRepository) {}
  async validate(value: string) {
    try {
      const result = await this.blogsQueryRepository.findBlogById(value);
      if (!result) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
