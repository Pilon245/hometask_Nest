import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  outputModel,
} from '../helper/helper.function';
import { filter } from 'rxjs';
import { SortDirection } from '../middlewares/query.validation';

export type FindBlogsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm?: string;
};

@Injectable()
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
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
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
    return await this.blogModel.findOne({ id }, { _id: false, __v: 0 });
  }
  async deleteAllBlogs() {
    return await this.blogModel.deleteMany();
  }
}
