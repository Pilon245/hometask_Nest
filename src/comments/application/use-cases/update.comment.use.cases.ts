import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import {
  CommentsFactory,
  CreateCommentUseCaseDto,
  UpdateCommentUseCaseDto,
} from '../../dto/commentsFactory';
import { LikeValueComment } from '../../entities/likes.comments.entity';
import { PostsRepository } from '../../../posts/posts.repository';
import { CommentsRepository } from '../../comments.repository';

export class UpdateCommentCommand {
  constructor(public updateUseCaseDto: UpdateCommentUseCaseDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    return await this.commentsRepository.updateComment(
      command.updateUseCaseDto.id,
      command.updateUseCaseDto.content,
    );
  }
}
