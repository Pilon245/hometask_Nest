import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';
import { Blogs } from '../../../../blogs/domain/entities/sql/blog.entity';
import { Posts } from './posts.entity';

@Entity()
export class LikePosts {
  @PrimaryColumn()
  id: string;

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

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;

  @OneToOne(() => Posts)
  @JoinColumn()
  post: Posts;

  @Column()
  postId: string;
}
