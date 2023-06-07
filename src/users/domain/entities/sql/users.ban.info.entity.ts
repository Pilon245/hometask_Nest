import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class UsersBanInfo {
  @Column({ nullable: true, default: null })
  banDate: string;

  @Column({ nullable: true, default: null })
  banReason: string;

  @Column({ default: false })
  isBanned: boolean;

  @OneToOne(() => Users, (u) => u.banInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @PrimaryColumn()
  userId: string;
}
