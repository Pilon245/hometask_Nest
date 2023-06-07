import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsSqlRepository } from '../../infrastructure/posts.sql.repository';
import { PostsOrmRepository } from 'src/posts/infrastructure/posts.orm.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsOrmRepository) {}

  async execute(command: DeletePostCommand) {
    return this.postsRepository.deletePosts(command.id);
  }
}
