import { BlogsRepository } from './blogs.repository';
import { Injectable, Scope } from '@nestjs/common';
import { BlogsFactory, CreateBlogInputDTO } from './dto/blogsFactory';
import {
  UpdateBlogInputModelType,
  UpdateBlogOnNewUser,
  UpdateBlogOnNewUserRepo,
} from './dto/update.blogs.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable({ scope: Scope.DEFAULT })
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
  ) {}
  async createBlogs(userId: string, inputModel: CreateBlogInputDTO) {
    //todo что лучше зашить логин в  jwt или сделать запросу в базу
    const user = await this.usersRepository.findUsersById(userId);
    const newBlog = new BlogsFactory(
      String(+new Date()),
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      new Date().toISOString(),
      {
        userId: user.id,
        userLogin: user.accountData.login,
      },
    );
    return this.blogsRepository.createBlogs(newBlog);
  }

  updateBlogs(id: string, model: UpdateBlogInputModelType) {
    const updateBlog: UpdateBlogInputModelType = {
      id: id,
      name: model.name,
      description: model.description,
      websiteUrl: model.websiteUrl,
    };
    return this.blogsRepository.updateBlogs(updateBlog);
  }
  updatePostsOnNewUser(login: string, model: UpdateBlogOnNewUser) {
    const updateBlog: UpdateBlogOnNewUserRepo = {
      id: model.id,
      userId: model.userId,
      userLogin: login,
    };
    return this.blogsRepository.updateBlogsOnNewUser(updateBlog);
  }
  deleteBlogs(id: string) {
    return this.blogsRepository.deleteBlogs(id);
  }
  async deleteAllBlogs() {
    return this.blogsRepository.deleteAllBlogs();
  }
}
