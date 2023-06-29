import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class TranslateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.translateMessages, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column()
  content: string;

  @Column()
  tContent: string;

  @Column()
  messageType: string;

  @Column({ type: 'double precision', default: new Date().valueOf() })
  createTime: number;
}
