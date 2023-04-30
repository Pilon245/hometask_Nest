import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersBanInfo } from 'src/users/domain/entities/sql/users.ban.info.entity';
import { PasswordConfirmation } from 'src/users/domain/entities/sql/password.confirmation.entity';
import { EmailConfirmation } from 'src/users/domain/entities/sql/email.confirmation.entity';

@Entity()
export class Users {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: string;

  @OneToOne(() => UsersBanInfo, (u) => u.user)
  @JoinColumn()
  banInfo: UsersBanInfo;

  @OneToOne(() => PasswordConfirmation, (p) => p.user)
  @JoinColumn()
  passwordConfirmation: PasswordConfirmation;

  @OneToOne(() => EmailConfirmation, (e) => e.user)
  @JoinColumn()
  emailConfirmation: EmailConfirmation;
}
