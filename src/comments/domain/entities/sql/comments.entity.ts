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
import { Posts } from '../../../../posts/domain/entities/sql/posts.entity';

@Entity()
export class Comments {
  @PrimaryColumn()
  id: string;

  @Column()
  createdAt: string;

  @Column()
  content: string;

  @Column({ default: false })
  isBanned: boolean;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @Column()
  commentatorUserId: string;

  @ManyToOne(() => Posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Posts;

  @Column()
  postId: string;
}
