import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';

export class DeleteCommentsCommand {}

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsUseCase
  implements ICommandHandler<DeleteCommentsCommand>
{
  constructor(private commentsRepository: CommentsSqlRepository) {}

  async execute() {
    return this.commentsRepository.deleteAllComment();
  }
}
