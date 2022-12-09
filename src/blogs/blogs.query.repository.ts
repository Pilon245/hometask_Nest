import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../helper/helper.function';
import { SortDirection } from '../validation/query.validation';

export type FindBlogsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm?: string;
};

@Injectable({ scope: Scope.DEFAULT })
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async findBlogs({
    searchNameTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindBlogsPayload) {
    const filter = {} as any;
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' };
    }
    const blogs = await this.blogModel
      .find(filter, { _id: false, __v: 0 }, {})
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
  async findBlogById(id: string): Promise<Blog> {
    return this.blogModel.findOne({ id }, { _id: false, __v: 0 });
  }
  async findBlogsOnSuperAdmin({
    searchNameTerm,
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindBlogsPayload) {
    const filter = {} as any;
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' };
    }
    const blogs = await this.blogModel
      .find(filter, { _id: false, __v: 0 }, {})
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
        blogOwnerInfo: {
          userId: b.blogOwnerInfo.userId,
          userLogin: b.blogOwnerInfo.userLogin,
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
      $or: [
        {
          name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' },
        },
        {
          'blogOwnerInfo.userId': userId,
        },
      ],
    };
    const blogs = await this.blogModel
      .find(filter, { _id: false, __v: 0 }, {})
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
    const blog = await this.blogModel
      .findOne({ id }, { _id: false, __v: 0 }, {})
      .lean();

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    };
  }
}
