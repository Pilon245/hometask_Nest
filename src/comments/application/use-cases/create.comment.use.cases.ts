import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  CommentsFactory,
  CreateCommentUseCaseDto,
} from '../../domain/dto/commentsFactory';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsSqlRepository } from '../../../posts/infrastructure/posts.sql.repository';

export class CreateCommentCommand {
  constructor(public createUseCaseDto: CreateCommentUseCaseDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private postsRepository: PostsSqlRepository,
    private commentsRepository: CommentsRepository,
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
