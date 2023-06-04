import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'double precision', default: new Date().valueOf() })
  createTime: number;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'on' })
  status: string;
}
