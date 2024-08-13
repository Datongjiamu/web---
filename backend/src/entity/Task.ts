import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ comment: '任务表' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '项目id' })
  @Index({ background: true })
  project_id: number;

  @Column({ comment: '任务名' })
  subject: string;

  @Column({ comment: '开始日期' })
  start_date: string;

  @Column({ comment: '截止日期' })
  end_date: string;

  @Column({ nullable: true, comment: '描述' })
  description: string;

  @Column({ comment: '类型' })
  type: number;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建日期' })
  create_date: string;
}
