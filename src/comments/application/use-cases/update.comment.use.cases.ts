import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentUseCaseDto } from '../../domain/dto/commentsFactory';
import { CommentsRepository } from '../../infrastructure/comments.repository';

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
