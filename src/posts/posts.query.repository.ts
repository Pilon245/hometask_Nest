import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/posts.entity';
import { Injectable } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../helper/helper.function';
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
    @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
  ) {}
  async findPostsNoAuth(
    { sortDirection, sortBy, pageSize, pageNumber }: FindBlogsPayload, //todo тут исправить тип
  ) {
    const posts = await this.postModel
      .find({}, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }],
      });
      const lastLikes = await this.likePostModel
        .find({
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
  async findPosts(
    userId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindBlogsPayload,
  ) {
    const posts = await this.postModel
      .find({}, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }],
      });
      const likeStatus = await this.likePostModel.findOne({
        $and: [{ postId: p.id }, { userId: userId }],
      });
      const lastLikes = await this.likePostModel
        .find({
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
          myStatus: likeStatus?.myStatus
            ? likeStatus.myStatus
            : LikeValuePost.none,
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
  async findPostByIdNoAuth(id: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ id }, { _id: false, __v: 0 })
      .exec();

    const totalLike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { likesStatus: 1 }],
    });
    const totalDislike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { dislikesStatus: 1 }],
    });
    const lastLikes = await this.likePostModel
      .find({
        $and: [{ postId: id }, { likesStatus: 1 }],
      })
      .sort({ addedAt: 'desc' })
      .lean();

    if (post) {
      const outPost: Post = {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
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
      return outPost;
    }
    return post;
  }
  async findPostById(id: string, userId: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ id }, { _id: false, __v: 0 })
      .exec();

    const totalLike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { likesStatus: 1 }],
    });
    const totalDislike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { dislikesStatus: 1 }],
    });
    const likeStatus = await this.likePostModel.findOne({
      $and: [{ postId: id }, { userId: userId }],
    });
    const lastLikes = await this.likePostModel
      .find({
        $and: [{ postId: id }, { likesStatus: 1 }],
      })
      .sort({ addedAt: 'desc' })
      .lean();

    if (post) {
      const outPost: Post = {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: totalLike,
          dislikesCount: totalDislike,
          myStatus: likeStatus?.myStatus
            ? likeStatus.myStatus
            : LikeValuePost.none,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
      return outPost;
    }
    return post;
  }
  async findPostByBlogIdNoAuth(
    blogId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindBlogsPayload,
  ) {
    const posts = await this.postModel
      .find({ blogId }, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }],
      });
      const lastLikes = await this.likePostModel
        .find({
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
    // if (posts.length === 0) {
    //   console.log('posts2', posts);
    //   return null;
    // }
    const items = await Promise.all(Promises);

    const totalCount = await this.postModel.countDocuments({ blogId });

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
  async findPostByBlogId(
    blogId: string,
    userId: string,
    { sortDirection, sortBy, pageSize, pageNumber }: FindBlogsPayload,
  ) {
    const posts = await this.postModel
      .find({ blogId }, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }],
      });
      const likeStatus = await this.likePostModel.findOne({
        $and: [{ postId: p.id }, { userId: userId }],
      });
      const lastLikes = await this.likePostModel
        .find({
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

    const totalCount = await this.postModel.countDocuments({ blogId });

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
}
