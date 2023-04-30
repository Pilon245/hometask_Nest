import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsSqlQueryRepository } from '../../blogs/infrastructure/blogs.sql.query.repository';
import { BlogsOrmQueryRepository } from 'src/blogs/infrastructure/blogs.orm.query.repository';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsOrmQueryRepository) {}

  async validate(value: string) {
    const result = await this.blogsQueryRepository.findBlogBD(value);
    if (!result) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
