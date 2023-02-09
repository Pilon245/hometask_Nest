import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  createdAt: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  websiteUrl: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;
}
