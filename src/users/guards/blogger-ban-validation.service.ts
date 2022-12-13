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
    try {
      console.log('value', value);
      console.log('this.blogsQueryRepository', this.blogsQueryRepository);
      const result = await this.blogsQueryRepository.findBlogById(value);
      console.log(result);
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
