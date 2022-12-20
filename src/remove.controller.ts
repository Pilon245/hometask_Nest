import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUsersCommand } from './users/application/use-cases/delete.all.users.use.cases';
import { DeletePostsCommand } from './posts/application/use-cases/delete.all.posts.use.cases';
import { DeleteBlogsCommand } from './blogs/application/use-cases/delete.all.blogs.use.cases';
import { DeleteCommentsCommand } from './comments/application/use-cases/delete.all.comment.use.cases';
import { DeleteSessionCommand } from './session/application/use-cases/delete.all.session.use.cases';

@Controller('testing/all-data')
export class RemoveController {
  constructor(private commandBus: CommandBus) {}
  @Delete()
  @HttpCode(204)
  deleteAllData() {
    this.commandBus.execute(new DeleteBlogsCommand());
    this.commandBus.execute(new DeletePostsCommand());
    this.commandBus.execute(new DeleteUsersCommand());
    this.commandBus.execute(new DeleteCommentsCommand());
    this.commandBus.execute(new DeleteSessionCommand());
    return;
  }
}
