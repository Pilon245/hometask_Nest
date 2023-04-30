import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentUseCaseDto } from '../../domain/dto/commentsFactory';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';
import { CommentsOrmRepository } from 'src/comments/infrastructure/comments.orm.repository';

export class UpdateCommentCommand {
  constructor(public updateUseCaseDto: UpdateCommentUseCaseDto) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsOrmRepository) {}

  async execute(command: UpdateCommentCommand) {
    return await this.commentsRepository.updateComment(
      command.updateUseCaseDto.id,
      command.updateUseCaseDto.content,
    );
  }
}
