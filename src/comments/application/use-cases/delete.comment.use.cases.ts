import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';

export class DeleteCommentCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsSqlRepository) {}

  async execute(command: DeleteCommentCommand) {
    return this.commentsRepository.deleteComment(command.id);
  }
}
