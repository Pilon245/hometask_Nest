import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from './entity.quiz..dto';
import {
  IsArray,
  IsBoolean,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BlogExistsRule } from '../../../posts/guards/blog-id-validation.service';

export class CreateAnswersInputModel {
  @IsString()
  @Length(10, 500)
  body: string;
  @IsArray()
  correctAnswers: string[];
}

export class QuizFactory {
  constructor(
    public id: string,
    public body: string,
    public answer: string,
    public published: boolean,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}

export class CreateQuizUseCaseDto {
  body: string;
  correctAnswers: string[];
}

export class UpdateQuizUseCaseDto {
  id: string;
  body: string;
  correctAnswers: string[];
}

export class UpdateQuizFactory {
  constructor(public id: string, public body: string, public answer: string) {}
}
