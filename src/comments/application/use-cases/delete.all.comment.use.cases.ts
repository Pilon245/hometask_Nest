import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';
import { CommentsOrmRepository } from 'src/comments/infrastructure/comments.orm.repository';

export class DeleteCommentsCommand {}

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsUseCase
  implements ICommandHandler<DeleteCommentsCommand>
{
  constructor(private commentsRepository: CommentsOrmRepository) {}

  async execute() {
    return this.commentsRepository.deleteAllComment();
  }
}
