import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import {
  CommentsFactory,
  CreateCommentUseCaseDto,
} from '../../domain/dto/commentsFactory';
import { LikeValueComment } from '../../domain/entities/likes.comments.entity';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(public createUseCaseDto: CreateCommentUseCaseDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const post = await this.postsRepository.findPostById(
      command.createUseCaseDto.postId,
    );
    const banUser = await this.usersRepository.findBanBloggerUsers(
      command.createUseCaseDto.userId,
      post.blogId,
    );
    if (banUser) return false;
    const newComment = new CommentsFactory(
      String(+new Date()),
      command.createUseCaseDto.content,
      command.createUseCaseDto.postId,
      new Date().toISOString(),
      // {
      //   likesCount: 0,
      //   dislikesCount: 0,
      //   myStatus: LikeValueComment.none,
      // },
      {
        userId: command.createUseCaseDto.userId,
        userLogin: command.createUseCaseDto.userLogin,
      },
      {
        id: command.createUseCaseDto.postId,
        title: post.title,
        blogId: post.blogId,
        blogName: post.blogName,
      },
      post.userId,
      false,
    );
    return this.commentsRepository.createComments(newComment);
  }
}
