import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsSqlRepository } from '../../infrastructure/posts.sql.repository';

export class DeletePostsCommand {}

@CommandHandler(DeletePostsCommand)
export class DeletePostsUseCase implements ICommandHandler<DeletePostsCommand> {
  constructor(private postsRepository: PostsSqlRepository) {}

  async execute() {
    return this.postsRepository.deleteAllPost();
  }
}
