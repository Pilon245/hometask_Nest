import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private usersQueryRepository: UsersQueryRepository) {}
  async validate(value: string) {
    const result = await this.usersQueryRepository.findUsersById(value);
    if (!result) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
