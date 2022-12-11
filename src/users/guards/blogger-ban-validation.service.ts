import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/blogs.query.repository';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'BloggerExists', async: true })
@Injectable()
export class BloggerExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}
  async validate(value: string) {
    const result = await this.blogsQueryRepository.findBlogById(value);
    if (!result) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
