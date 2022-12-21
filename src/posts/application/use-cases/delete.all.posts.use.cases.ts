import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostsCommand {}

@CommandHandler(DeletePostsCommand)
export class DeletePostsUseCase implements ICommandHandler<DeletePostsCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute() {
    return this.postsRepository.deleteAllPost();
  }
}
