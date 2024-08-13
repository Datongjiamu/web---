import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ comment: '任务附件表' })
export class TaskAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '任务id' })
  @Index({ background: true })
  task_id: number;

  @Column({ comment: '文件名' })
  file_name: string;

  @Column({ unique: true, comment: '文件路径' })
  file_path: string;
}
