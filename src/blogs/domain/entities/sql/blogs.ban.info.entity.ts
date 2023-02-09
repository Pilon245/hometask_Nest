import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';
import { Blogs } from './blog.entity';

@Entity()
export class BlogsBanInfo {
  @Column()
  banDate: string;

  @Column({ default: false })
  isBanned: boolean;

  @OneToOne(() => Blogs)
  @JoinColumn()
  blog: Blogs;

  @PrimaryGeneratedColumn()
  blogId: string;
}
