import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsSqlRepository } from '../../infrastructure/posts.sql.repository';
import { PostsOrmRepository } from 'src/posts/infrastructure/posts.orm.repository';

export class DeletePostsCommand {}

@CommandHandler(DeletePostsCommand)
export class DeletePostsUseCase implements ICommandHandler<DeletePostsCommand> {
  constructor(private postsRepository: PostsOrmRepository) {}

  async execute() {
    return this.postsRepository.deleteAllPost();
  }
}
