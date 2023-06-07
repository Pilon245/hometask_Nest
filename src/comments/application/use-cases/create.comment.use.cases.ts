import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  CommentsFactory,
  CreateCommentUseCaseDto,
} from '../../domain/dto/commentsFactory';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsSqlRepository } from '../../../posts/infrastructure/posts.sql.repository';
import { CommentsSqlRepository } from '../../infrastructure/comments.sql.repository';
import { CommentsOrmRepository } from 'src/comments/infrastructure/comments.orm.repository';
import { PostsOrmRepository } from 'src/posts/infrastructure/posts.orm.repository';

export class CreateCommentCommand {
  constructor(public createUseCaseDto: CreateCommentUseCaseDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private postsRepository: PostsOrmRepository,
    private commentsRepository: CommentsOrmRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const newComment = new CommentsFactory(
      String(+new Date()),
      command.createUseCaseDto.content,
      command.createUseCaseDto.postId,
      new Date().toISOString(),
      {
        userId: command.createUseCaseDto.userId,
        userLogin: command.createUseCaseDto.userLogin,
      },
      {
        id: command.createUseCaseDto.postId,
        title: command.createUseCaseDto.title,
        blogId: command.createUseCaseDto.blogId,
        blogName: command.createUseCaseDto.blogName,
      },
      command.createUseCaseDto.ownerUserId,
      false,
    );
    return this.commentsRepository.createComments(newComment);
  }
}
