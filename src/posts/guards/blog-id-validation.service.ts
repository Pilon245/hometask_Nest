import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/blogs.query.repository';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}
  async validate(value: string) {
    console.log('value', value);
    const result = await this.blogsQueryRepository.findBlogById(value);
    if (!result) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
