import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComments } from '../entity/TaskComments';
import { Context } from '@midwayjs/koa';

@Provide()
export class TaskCommentService {
  @InjectEntityModel(TaskComments)
  commentRepository: Repository<TaskComments>;

  @Inject()
  ctx: Context;

  async create(
    username: string,
    message: string,
    task_id: number
  ): Promise<TaskComments> {
    const newComment = this.commentRepository.create({
      username,
      message,
      task_id,
    });
    newComment.timestamp = Date.now();
    return await this.commentRepository.save(newComment);
  }

  async getCommentById(comment_id: number): Promise<TaskComments> {
    return this.commentRepository.findOneBy({ id: comment_id });
  }

  async getCommentsByTaskId(task_id: number): Promise<TaskComments[]> {
    return this.commentRepository.findBy({ task_id: task_id });
  }

  async deleteCommentById(comment_id: number): Promise<void> {
    const comment = await this.getCommentById(comment_id);
    await this.commentRepository.remove(comment);
  }

  async deleteCommentByTaskId(taskId: number): Promise<void> {
    const taskComments = await this.getCommentsByTaskId(taskId);
    for (const taskComment of taskComments) {
      await this.deleteCommentById(taskComment.id);
    }
  }
}
