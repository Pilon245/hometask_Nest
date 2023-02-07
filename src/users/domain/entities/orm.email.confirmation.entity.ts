import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './orm.user.entity';

@Entity()
export class EmailConfirmation {
  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: string;

  @Column()
  isConfirmed: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
