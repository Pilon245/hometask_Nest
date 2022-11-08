import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { SortDirection } from './blogs.controller';
import { getPagesCounts, getSkipNumber } from '../helper/helper.function';
import { filter } from 'rxjs';

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
    const blogs = await this.blogModel
      .find({}, { _id: false, __v: 0 }, {})
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.blogModel.countDocuments(filter);

    return {
      pagesCount: getPagesCounts(totalCount, pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs.map((b) => ({
        id: b.id,
        name: b.name,
        youtubeUrl: b.youtubeUrl,
        createdAt: b.createdAt,
      })),
    };
  }
  async findBlogById(id: string): Promise<Blog> {
    return await this.blogModel.findOne({ id }).exec();
  }
  async deleteAllBlogs() {
    return await this.blogModel.deleteMany();
  }
}
