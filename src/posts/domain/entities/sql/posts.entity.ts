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

@Entity()
export class Posts {
  @PrimaryColumn()
  id: string;

  @Column()
  createdAt: string;

  @Column()
  content: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column()
  shortDescription: string;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;

  @ManyToOne(() => Blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: Blogs;

  @Column()
  blogId: string;
}
