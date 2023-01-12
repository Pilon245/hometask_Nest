import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable, Scope } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersSqlRepository } from '../../users/infrastructure/users.sql.repository';

@Injectable({ scope: Scope.DEFAULT })
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersSqlRepository,
  ) {}
  // async createBlogs(userId: string, inputModel: CreateBlogInputDTO) {
  //   //todo что лучше зашить логин в  jwt или сделать запросу в базу
  //   const user = await this.usersRepository.findUsersById(userId);
  //   const newBlog = new BlogsFactory(
  //     String(+new Date()),
  //     inputModel.name,
  //     inputModel.description,
  //     inputModel.websiteUrl,
  //     new Date().toISOString(),
  //     {
  //       userId: user.id,
  //       userLogin: user.accountData.login,
  //     },
  //     { isBanned: false, banDate: null },
  //   );
  //   return this.blogsRepository.createBlogs(newBlog);
  // }
}
