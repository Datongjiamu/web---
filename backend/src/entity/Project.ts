import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ comment: '项目表' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '任务名' })
  name: string;

  @Column({ comment: '所有者' })
  @Index({ background: true })
  owner: number;

  @Column({ comment: '创建日期' })
  create_time: number;
}
