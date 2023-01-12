import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/entities/blog.entity';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import { SortDirection } from '../../validation/query.validation';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export type FindBlogsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm?: string;
};

@Injectable({ scope: Scope.DEFAULT })
export class BlogsSqlQueryRepository {
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

  async findBlogs({
    searchNameTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindBlogsPayload) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const blogs = await this.dataSource.query(
      `${this.select} 
      WHERE "name" like '%${searchNameTerm}%' AND "isBanned" = false 
      ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) 
                    FROM "Blogs" as blogs
                    LEFT JOIN "BlogsBanInfo" as ban
                    ON ban."blogId" = blogs."id"
                    WHERE "name" like '%${searchNameTerm}%' AND "isBanned" = false`,
    );
    const totalCount = +valueCount[0].count;
    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: blogs.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
      })),
    };
  }
  async findBlogById(id: string) {
    const blogs = await this.dataSource.query(
      `${this.select} 
      WHERE "id" like '%${id}%' AND "isBanned" = false`,
    );
    return {
      id: blogs[0].id,
      name: blogs[0].name,
      description: blogs[0].description,
      websiteUrl: blogs[0].websiteUrl,
      createdAt: blogs[0].createdAt,
      banInfo: {
        isBanned: blogs[0].isBanned,
        banDate: blogs[0].banDate,
      },
    };
  }
  async findBlogBD(id: string): Promise<Blog> {
    const blogs = await this.dataSource.query(
      `${this.select} 
      WHERE "id" like '%${id}%' AND "isBanned" = false`,
    );
    return {
      id: blogs[0].id,
      name: blogs[0].name,
      description: blogs[0].description,
      websiteUrl: blogs[0].websiteUrl,
      createdAt: blogs[0].createdAt,
      blogOwnerInfo: {
        userId: blogs[0].userId,
        userLogin: blogs[0].login,
      },
      banInfo: {
        isBanned: blogs[0].isBanned,
        banDate: blogs[0].banDate,
      },
    };
  }
  async findBlogByUserId(id: string): Promise<Blog> {
    const blogs = await this.dataSource.query(
      `${this.select} 
      WHERE "userId" like '%${id}%' AND "isBanned" = false`,
    );
    return {
      id: blogs[0].id,
      name: blogs[0].name,
      description: blogs[0].description,
      websiteUrl: blogs[0].websiteUrl,
      createdAt: blogs[0].createdAt,
      blogOwnerInfo: {
        userId: blogs[0].userId,
        userLogin: blogs[0].login,
      },
      banInfo: {
        isBanned: blogs[0].isBanned,
        banDate: blogs[0].banDate,
      },
    };
  }
  async findBlogsOnSuperAdmin({
    searchNameTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindBlogsPayload) {
    const skip = getSkipNumber(pageNumber, pageSize);
    const blogs = await this.dataSource.query(
      `${this.select} 
      WHERE "name" like '%${searchNameTerm}%'
      ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET  ${skip}`,
    );
    const valueCount = await this.dataSource.query(
      `SELECT count(*) FROM "Blogs" as blogs
                    WHERE "name" like '%${searchNameTerm}%'`,
    );
    const totalCount = +valueCount[0].count;
    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: blogs.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        blogOwnerInfo: {
          userId: b.userId,
          userLogin: b.login,
        },
        banInfo: {
          isBanned: b.isBanned,
          banDate: b.banDate,
        },
      })),
    };
  }
  async findBlogsOnBlogger(
    userId: string,
    {
      searchNameTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
    }: FindBlogsPayload,
  ) {
    const filter = {
      $and: [
        {
          name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' },
        },
        {
          'blogOwnerInfo.userId': userId,
        },
        {
          'banInfo.isBanned': false,
        },
      ],
    };
    const blogs = await this.blogModel
      .find(filter, { _id: false, __v: 0, 'banInfo.isBanned': 0 }, {})
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.blogModel.countDocuments(filter);

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: blogs.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
      })),
    };
  }
  async findBlogByIdOnBlogger(id: string) {
    const blog = await this.dataSource
      .query(`SELECT name, description, "websiteUrl", "createdAt", id, "userId"
FROM public."Blogs";`);
    await this.blogModel
      .findOne(
        { id, 'banInfo.isBanned': false },
        { _id: false, __v: 0, 'banInfo.isBanned': 0 },
        {},
      )
      .lean();

    return {
      id: blog[0].id,
      name: blog[0].name,
      description: blog[0].description,
      websiteUrl: blog[0].websiteUrl,
      createdAt: blog[0].createdAt,
    };
  }
}
