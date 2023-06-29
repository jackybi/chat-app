import { TranslateMessage } from 'src/translate-message/entities/translate-message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: 'Hello world' })
  description: string;

  @Column({ default: 'avatar.webp' })
  avatar: string;

  @Column()
  password: string;

  @Column({ type: 'double precision', default: new Date().valueOf() })
  createTime: number;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'on' })
  status: string;

  @OneToMany(() => TranslateMessage, (message) => message.user)
  translateMessages: TranslateMessage[];
}
