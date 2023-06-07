import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';
import { Blogs } from '../../../../blogs/domain/entities/sql/blog.entity';
import { Posts } from './posts.entity';

@Entity()
export class LikePosts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  addedAt: string;

  @Column()
  dislikesStatus: string;

  @Column()
  likesStatus: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column()
  myStatus: string;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;

  @ManyToOne(() => Posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Posts;

  @Column()
  postId: string;
}
