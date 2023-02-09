import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';

@Entity()
export class Sessions {
  @PrimaryColumn()
  deviceId: string;

  @Column()
  expiresDate: string;

  @Column()
  ip: string;

  @Column()
  lastActiveDate: string;

  @Column()
  title: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;
}
