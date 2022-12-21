import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../domain/entities/posts.entity';
import { Injectable, Scope } from '@nestjs/common';
import { getSkipNumber, outputModel } from '../../helper/helper.function';
import {
  LikePost,
  LikePostDocument,
  LikeValuePost,
} from '../domain/entities/likes.posts.entity';
import { SortDirection } from '../../validation/query.validation';

export type FindPostsPayload = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
};

@Injectable({ scope: Scope.DEFAULT })
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
  ) {}
  // async findPostsNoAuth({
  //   sortDirection,
  //   sortBy,
  //   pageSize,
  //   pageNumber,
  // }: FindPostsPayload) {
  //   const posts = await this.postModel
  //     .find({ isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
  //     .sort([[sortBy, sortDirection]])
  //     .skip(getSkipNumber(pageNumber, pageSize))
  //     .limit(pageSize)
  //     .lean();
  //
  //   const Promises = posts.map(async (p) => {
  //     const totalLike = await this.likePostModel.countDocuments({
  //       $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
  //     });
  //     const totalDislike = await this.likePostModel.countDocuments({
  //       $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
  //     });
  //     const lastLikes = await this.likePostModel
  //       .find({
  //         $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
  //       })
  //       .sort({ addedAt: 'desc' })
  //       // .limit(3)
  //       .lean();
  //     return {
  //       id: p.id,
  //       title: p.title,
  //       shortDescription: p.shortDescription,
  //       content: p.content,
  //       blogId: p.blogId,
  //       blogName: p.blogName,
  //       createdAt: p.createdAt,
  //       extendedLikesInfo: {
  //         likesCount: totalLike,
  //         dislikesCount: totalDislike,
  //         myStatus: LikeValuePost.none,
  //         newestLikes: lastLikes.slice(0, 3).map((l) => ({
  //           addedAt: l.addedAt,
  //           userId: l.userId,
  //           login: l.login,
  //         })),
  //       },
  //     };
  //   });
  //   const items = await Promise.all(Promises);
  //
  //   const totalCount = await this.postModel.countDocuments({ isBanned: false });
  //
  //   return {
  //     ...outputModel(totalCount, pageSize, pageNumber),
  //     items: items,
  //   };
  // }
  async findPosts(
    { sortDirection, sortBy, pageSize, pageNumber }: FindPostsPayload,
    userId?: string,
  ) {
    const posts = await this.postModel
      .find({ isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();

    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });
      let likeStatus = LikeValuePost.none;
      if (userId) {
        const status = await this.likePostModel.findOne({
          $and: [{ postId: p.id }, { userId: userId }, { isBanned: false }],
        });
        likeStatus = status?.myStatus || LikeValuePost.none;
      }
      const lastLikes = await this.likePostModel
        .find({
          $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
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
          myStatus: likeStatus,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    });
    const items = await Promise.all(Promises);

    const totalCount = await this.postModel.countDocuments({ isBanned: false });

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
  // async findPostByIdNoAuth(id: string) {
  //   const post = await this.postModel
  //     .findOne({ id, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
  //     .exec();
  //
  //   const totalLike = await this.likePostModel.countDocuments({
  //     $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
  //   });
  //   const totalDislike = await this.likePostModel.countDocuments({
  //     $and: [{ postId: id }, { dislikesStatus: 1 }, { isBanned: false }],
  //   });
  //   const lastLikes = await this.likePostModel
  //     .find({
  //       $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
  //     })
  //     .sort({ addedAt: 'desc' })
  //     .lean();
  //
  //   if (post) {
  //     const outPost = {
  //       id: post.id,
  //       title: post.title,
  //       shortDescription: post.shortDescription,
  //       content: post.content,
  //       blogId: post.blogId,
  //       blogName: post.blogName,
  //       createdAt: post.createdAt,
  //       extendedLikesInfo: {
  //         likesCount: totalLike,
  //         dislikesCount: totalDislike,
  //         myStatus: LikeValuePost.none,
  //         newestLikes: lastLikes.slice(0, 3).map((l) => ({
  //           addedAt: l.addedAt,
  //           userId: l.userId,
  //           login: l.login,
  //         })),
  //       },
  //     };
  //     return outPost;
  //   }
  //   return post;
  // }
  async findPostById(id: string, userId?: string) {
    const post = await this.postModel
      .findOne({ id, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .exec();

    const totalLike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
    });
    const totalDislike = await this.likePostModel.countDocuments({
      $and: [{ postId: id }, { dislikesStatus: 1 }, { isBanned: false }],
    });

    let likeStatus = LikeValuePost.none;
    if (userId) {
      const status = await this.likePostModel.findOne({
        $and: [{ postId: id }, { userId: userId }, { isBanned: false }],
      });
      likeStatus = status?.myStatus || LikeValuePost.none;
    }
    const lastLikes = await this.likePostModel
      .find({
        $and: [{ postId: id }, { likesStatus: 1 }, { isBanned: false }],
      })
      .sort({ addedAt: 'desc' })
      .lean();

    if (post) {
      const outPost = {
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
          myStatus: likeStatus,
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
  // async findPostByBlogIdNoAuth(
  //   blogId: string,
  //   { sortDirection, sortBy, pageSize, pageNumber }: FindPostsPayload,
  // ) {
  //   const posts = await this.postModel
  //     .find({ blogId, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
  //     .sort([[sortBy, sortDirection]])
  //     .skip(getSkipNumber(pageNumber, pageSize))
  //     .limit(pageSize)
  //     .lean();
  //   const Promises = posts.map(async (p) => {
  //     const totalLike = await this.likePostModel.countDocuments({
  //       $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
  //     });
  //     const totalDislike = await this.likePostModel.countDocuments({
  //       $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
  //     });
  //     const lastLikes = await this.likePostModel
  //       .find({
  //         $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
  //       })
  //       .sort({ addedAt: 'desc' })
  //       .lean();
  //     return {
  //       id: p.id,
  //       title: p.title,
  //       shortDescription: p.shortDescription,
  //       content: p.content,
  //       blogId: p.blogId,
  //       blogName: p.blogName,
  //       createdAt: p.createdAt,
  //       extendedLikesInfo: {
  //         likesCount: totalLike,
  //         dislikesCount: totalDislike,
  //         myStatus: LikeValuePost.none,
  //         newestLikes: lastLikes.slice(0, 3).map((l) => ({
  //           addedAt: l.addedAt,
  //           userId: l.userId,
  //           login: l.login,
  //         })),
  //       },
  //     };
  //   });
  //   const items = await Promise.all(Promises);
  //
  //   const totalCount = await this.postModel.countDocuments({
  //     blogId,
  //     isBanned: false,
  //   });
  //
  //   return {
  //     ...outputModel(totalCount, pageSize, pageNumber),
  //     items: items,
  //   };
  // }
  async findPostByBlogId(
    { sortDirection, sortBy, pageSize, pageNumber }: FindPostsPayload,
    blogId: string,
    userId?: string,
  ) {
    const posts = await this.postModel
      .find({ blogId, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const Promises = posts.map(async (p) => {
      const totalLike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
      });
      const totalDislike = await this.likePostModel.countDocuments({
        $and: [{ postId: p.id }, { dislikesStatus: 1 }, { isBanned: false }],
      });

      let likeStatus = LikeValuePost.none;
      if (userId) {
        const status = await this.likePostModel.findOne({
          $and: [{ postId: p.id }, { userId: userId }, { isBanned: false }],
        });
        likeStatus = status?.myStatus || LikeValuePost.none;
      }
      const lastLikes = await this.likePostModel
        .find({
          $and: [{ postId: p.id }, { likesStatus: 1 }, { isBanned: false }],
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
          myStatus: likeStatus,
          newestLikes: lastLikes.slice(0, 3).map((l) => ({
            addedAt: l.addedAt,
            userId: l.userId,
            login: l.login,
          })),
        },
      };
    });
    const items = await Promise.all(Promises);

    const totalCount = await this.postModel.countDocuments({
      blogId,
      isBanned: false,
    });

    return {
      ...outputModel(totalCount, pageSize, pageNumber),
      items: items,
    };
  }
}
