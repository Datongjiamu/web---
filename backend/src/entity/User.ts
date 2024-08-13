import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ comment: '用户表' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '用户名' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ unique: true, comment: '邮箱' })
  @Index()
  email: string;

  @Column('simple-array', { nullable: true, comment: '协作项目' })
  collaborate: number[];

  @Column({ nullable: true, comment: '登录时间' })
  login_time: number;
}
