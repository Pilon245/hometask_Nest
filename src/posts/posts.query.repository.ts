import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/posts.entity';
import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  outputModel,
} from '../helper/helper.function';
import { FindBlogsPayload } from '../blogs/blogs.query.repository';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from './entities/likes.posts.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name) private LikePostModel: Model<LikePostDocument>,
  ) {}
  async findPosts({
    sortDirection,
    sortBy,
    pageSize,
    pageNumber,
  }: FindBlogsPayload) {
    const posts = await this.postModel
      .find({}, { _id: false, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const Promises = posts.map(async (p) => {
      const totalLike = await this.LikePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      });
      const totalDislike = await this.LikePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }],
      });
      const lastLikes = await this.LikePostModel.find({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      })
        .sort({ addedAt: 'desc' })
        .lean();
      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: LikeValuePost.none,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    });
    const items = await Promise.all(Promises);

    const totalCount = await this.postModel.countDocuments();

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
  async findPostById(id: string): Promise<Post> {
    return await this.postModel.findOne({ id }, { _id: false, __v: 0 }).exec();
  }
  async findPostByBlogId(
    blogId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindBlogsPayload,
  ) {
    const posts = await this.postModel
      .find({ blogId }, { _id: false, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const totalCount = await this.postModel.countDocuments({ blogId });

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: posts.map((p) => ({
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        // extendedLikesInfo: {
        //   likesCount: 0,
        //   dislikesCount: 0,
        //   myStatus: 'None',
        //   newestLikes: [],
        // },
      })),
    };
  }
  async deleteAllPosts() {
    return await this.postModel.deleteMany();
  }
}
