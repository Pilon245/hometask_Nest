import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUsersCommand } from './users/application/use-cases/delete.all.users.use.cases';
import { DeletePostsCommand } from './posts/application/use-cases/delete.all.posts.use.cases';
import { DeleteBlogsCommand } from './blogs/application/use-cases/delete.all.blogs.use.cases';
import { DeleteCommentsCommand } from './comments/application/use-cases/delete.all.comment.use.cases';
import { DeleteSessionCommand } from './session/application/use-cases/delete.all.session.use.cases';

@Controller()
export class RemoveController {
  constructor(private commandBus: CommandBus) {}
  @Get()
  async get() {
    return "Hello, I'm Said";
  }
  @Delete('testing/all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.commandBus.execute(new DeleteBlogsCommand());
    await this.commandBus.execute(new DeletePostsCommand());
    await this.commandBus.execute(new DeleteUsersCommand());
    await this.commandBus.execute(new DeleteCommentsCommand());
    await this.commandBus.execute(new DeleteSessionCommand());
    return;
  }
}
