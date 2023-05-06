import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../../../../users/domain/entities/sql/user.entity';

@Entity()
export class Blogs {
  @PrimaryColumn()
  id: string;

  @Column()
  createdAt: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  websiteUrl: string;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @Column()
  userId: string;
}
