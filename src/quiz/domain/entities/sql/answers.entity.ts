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
import { Blogs } from '../../../../blogs/domain/entities/sql/blog.entity';
import { Quiz } from './quiz.entity';

@Entity()
export class Answers {
  @Column()
  correctAnswers: string;

  @ManyToOne(() => Quiz, (q) => q.answers)
  @JoinColumn()
  quiz: Quiz;

  @PrimaryColumn()
  quizId: string;
}
