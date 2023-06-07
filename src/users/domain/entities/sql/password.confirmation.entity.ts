import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class PasswordConfirmation {
  @Column({ nullable: true, default: null })
  confirmationCode: string;

  @Column({ nullable: true, default: null })
  expirationDate: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @OneToOne(() => Users, (u) => u.passwordConfirmation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @PrimaryColumn()
  userId: string;
}
