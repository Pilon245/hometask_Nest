import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column()
  correctAnswers: string;

  @Column({ default: false })
  published: boolean;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
