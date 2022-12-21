import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class DeleteCommentsCommand {}

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsUseCase
  implements ICommandHandler<DeleteCommentsCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute() {
    return this.commentsRepository.deleteAllComment();
  }
}
