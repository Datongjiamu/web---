import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ comment: '任务评论表' })
export class TaskComments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '任务id' })
  @Index({ background: true })
  task_id: number;

  @Column({ comment: '用户名' })
  username: string;

  @Column({ comment: '内容' })
  message: string;

  @Column({ comment: '时间' })
  timestamp: number;
}
