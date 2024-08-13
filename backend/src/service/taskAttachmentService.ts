import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAttachment } from '../entity/TaskAttachment';
import { join } from 'path';
import * as fs from 'node:fs';
import { Context } from '@midwayjs/koa';

@Provide()
export class TaskAttachmentService {
  @InjectEntityModel(TaskAttachment)
  taskAttachmentRepository: Repository<TaskAttachment>;

  @Inject()
  ctx: Context;

  async create(
    file_name: string,
    file_path: string,
    task_id: number
  ): Promise<TaskAttachment> {
    const newUploadFile: TaskAttachment = this.taskAttachmentRepository.create({
      file_name,
      file_path,
      task_id,
    });
    return this.taskAttachmentRepository.save(newUploadFile);
  }

  async getTaskAttachmentByTaskId(task_id: number): Promise<TaskAttachment[]> {
    return this.taskAttachmentRepository.findBy({ task_id: task_id });
  }

  async getTaskAttachment(file_id: number): Promise<TaskAttachment> {
    return this.taskAttachmentRepository.findOneBy({ id: file_id });
  }

  async deleteTaskAttachment(file: TaskAttachment): Promise<void> {
    const task_id = file.task_id;
    const file_name = file.file_name;
    const upload_dir = this.ctx.app.getConfig('upload.baseDir');
    const file_path = join(upload_dir, task_id.toString() + '-' + file_name);
    fs.unlinkSync(file_path);
    await this.taskAttachmentRepository.remove(file);
  }

  async deleteUploadFileById(file_id: number): Promise<void> {
    const file = await this.getTaskAttachment(file_id);
    await this.deleteTaskAttachment(file);
  }

  async deleteUploadFileByTaskId(taskId: number): Promise<void> {
    const taskAttachments = await this.getTaskAttachmentByTaskId(taskId);
    for (const file of taskAttachments) {
      await this.deleteTaskAttachment(file);
    }
  }
}
