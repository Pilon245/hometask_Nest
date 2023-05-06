import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';
import { Blogs } from './blog.entity';

@Entity()
export class BlogsBanInfo {
  @Column({ nullable: true })
  banDate: string;

  @Column({ default: false })
  isBanned: boolean;

  @OneToOne(() => Blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: Blogs;

  @PrimaryColumn()
  blogId: string;
}
