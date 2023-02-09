import {
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => Blogs)
  @JoinColumn()
  blog: Blogs;

  @Column()
  blogId: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;
}
