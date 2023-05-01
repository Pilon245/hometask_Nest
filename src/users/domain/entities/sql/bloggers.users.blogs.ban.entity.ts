import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Blogs } from '../../../../blogs/domain/entities/sql/blog.entity';

@Entity()
export class BloggersUsersBlogsBan {
  @PrimaryColumn()
  id: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true, default: null })
  banDate: string;

  @Column({ nullable: true, default: null })
  banReason: string;

  @ManyToOne(() => Blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: Blogs;

  @Column()
  blogId: string;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;
}
