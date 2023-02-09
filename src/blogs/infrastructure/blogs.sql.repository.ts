import { Injectable, Scope } from '@nestjs/common';
import { Blog, BlogDocument } from '../domain/entities/nosql/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDTO } from '../domain/dto/blogsFactory';
import {
  BanBlogsRepo,
  UpdateBlogInputModelType,
  UpdateBlogOnNewUserRepo,
} from '../domain/dto/update.blogs.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class BlogsSqlRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  select = `SELECT blogs."id", blogs."name", blogs."description", blogs."websiteUrl",
    blogs."createdAt",  blogs."userId", users."login", 
    ban."isBanned",ban."banDate"
    FROM "Blogs" as blogs
    LEFT JOIN "Users" as users
    ON users."id" = blogs."userId"
    LEFT JOIN "BlogsBanInfo" as ban
    ON ban."blogId" = blogs."id"`;

  async findBlogById(id: string) {
    const blog = await this.dataSource.query(
      `${this.select} 
      WHERE blogs."id" like '%${id}%' AND "isBanned" = false`,
    );
    return {
      id: blog[0].id,
      name: blog[0].name,
      description: blog[0].description,
      websiteUrl: blog[0].websiteUrl,
      createdAt: blog[0].createdAt,
    };
  }
  async createBlogs(blog: CreateBlogDTO) {
    //todo сделать свагер

    await this.dataSource.query(`INSERT INTO public."Blogs"(
      "id","name", "description", "websiteUrl", "createdAt",  "userId")
    VALUES ('${blog.id}', '${blog.name}', '${blog.description}','${blog.websiteUrl}' ,
      '${blog.createdAt}', '${blog.blogOwnerInfo.userId}');

    INSERT INTO "BlogsBanInfo"("blogId", "isBanned", "banDate")
    VALUES( '${blog.id}', ${blog.banInfo.isBanned}, ${blog.banInfo.banDate});`);

    return;
  }
  async updateBlogs(blog: UpdateBlogInputModelType) {
    await this.dataSource.query(
      `UPDATE "Blogs"
	      SET "name"='${blog.name}', "description" = '${blog.description}',
	      "websiteUrl" = '${blog.websiteUrl}'
        WHERE "id" = '${blog.id}';`,
    );
    return true;
  }
  async updateBlogsOnNewUser(model: UpdateBlogOnNewUserRepo) {
    await this.dataSource.query(
      `UPDATE "Blogs"
	      SET "userId"='${model.userId}'
        WHERE "id" = '${model.id}';`,
    );
    return true;
  }
  async banUsers(userId: string, value: boolean) {
    const blogs = await this.dataSource.query(`${this.select}
     WHERE "userId" = '${userId}' `);
    if (!blogs[0]) return true;
    await this.dataSource.query(
      `UPDATE "BlogsBanInfo"
	      SET "isBanned"='${value}'
        WHERE "blogId" = '${blogs[0].id}';`,
    );
    return true;
  }
  async banBlogs(banBlogs: BanBlogsRepo) {
    await this.dataSource.query(
      `UPDATE "BlogsBanInfo"
	      SET "isBanned"='${banBlogs.isBanned}', "banDate"='${banBlogs.banDate}'
        WHERE "blogId" = '${banBlogs.id}';`,
    );
    return true;
  }
  async deleteBlogs(id: string) {
    await this.dataSource.query(`DELETE FROM "Blogs"
	      WHERE "id" = '${id}';`);
    return true;
  }
  async deleteAllBlogs() {
    await this.dataSource.query(`DELETE FROM "Blogs"`);
    return true;
  }
}
