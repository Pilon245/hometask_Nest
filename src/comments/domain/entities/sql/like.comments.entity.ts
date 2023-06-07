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
import { Comments } from './comments.entity';

@Entity()
export class LikeComments {
  @PrimaryGeneratedColumn()
  id: string;

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

  @ManyToOne(() => Comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: Comments;

  @Column()
  commentId: string;
}
