import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Task } from '../entity/Task';
import { Repository } from 'typeorm';
import { TaskReq } from '../interface';
import { Context } from '@midwayjs/koa';
import { TaskAttachmentService } from './taskAttachmentService';
import { TaskCommentService } from './taskCommentService';

@Provide()
export class TaskService {
  @InjectEntityModel(Task)
  taskRepository: Repository<Task>;

  @Inject()
  taskAttachmentService: TaskAttachmentService;
  @Inject()
  taskCommentService: TaskCommentService;

  @Inject()
  ctx: Context;

  async getTaskListByProjectId(projectId: number): Promise<Task[]> {
    return this.taskRepository.findBy({ project_id: projectId });
  }

  async getTaskById(taskId: number): Promise<Task> {
    return this.taskRepository.findOneBy({ id: taskId });
  }

  async create(taskReq: TaskReq): Promise<Task> {
    const newProject = this.taskRepository.create(taskReq);
    return this.taskRepository.save(newProject);
  }

  async update(task: Task): Promise<void> {
    await this.taskRepository.update(task.id, task);
  }

  async deleteTaskByProjectId(projectId: number): Promise<void> {
    const tasks = await this.getTaskListByProjectId(projectId);
    for (const task of tasks) {
      await this.delete(task.id);
    }
  }
  async delete(taskId: number): Promise<void> {
    const task = await this.getTaskById(taskId);
    await this.taskRepository.remove(task);
    await this.deleteTaskOther(taskId);
  }

  async deleteTaskOther(taskId: number): Promise<void> {
    await this.taskAttachmentService.deleteUploadFileByTaskId(taskId);
    await this.taskCommentService.deleteCommentByTaskId(taskId);
  }
}
