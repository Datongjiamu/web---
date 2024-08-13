import {
  Body,
  Controller,
  Del,
  Fields,
  Files,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ProjectService } from '../service/ProjectService';
import { JwtService } from '@midwayjs/jwt';
import { TaskService } from '../service/TaskService';
import { TaskReq } from '../interface';
import { join } from 'path';
import * as fs from 'node:fs';
import { existsSync } from 'node:fs';
import { readFileSync } from 'fs';
import { User } from '../entity/User';
import { Task } from '../entity/Task';
import { TaskAttachmentService } from '../service/taskAttachmentService';
import { TaskCommentService } from '../service/taskCommentService';

@Controller('/task')
export class TaskController {
  @Inject()
  ctx: Context;

  @Inject()
  projectService: ProjectService;

  @Inject()
  jwtService: JwtService;

  @Inject()
  taskService: TaskService;

  @Inject()
  taskAttachmentService: TaskAttachmentService;

  @Inject()
  taskCommentService: TaskCommentService;

  @Post('/')
  async create(@Body() taskReq: TaskReq) {
    try {
      const projectId = taskReq.project_id;
      const user = this.ctx.state.user as User;
      await this.projectService.ensureValidProjectId(projectId, user, false);
      const newProject = await this.taskService.create(taskReq);
      return { success: true, value: newProject };
    } catch (err) {
      console.log(err);
      return { success: false, value: err.message };
    }
  }

  @Get('/')
  async getAll(@Query('project_id') projectId: number) {
    try {
      const user = this.ctx.state.user as User;
      await this.projectService.ensureValidProjectId(projectId, user, false);
      const taskList = await this.taskService.getTaskListByProjectId(projectId);
      return { success: true, value: taskList };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  @Del('/')
  async delete(@Query('task_id') taskId: number) {
    try {
      const user = this.ctx.state.user as User;
      const task = await this.taskService.getTaskById(taskId);
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      await this.taskService.delete(taskId);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, value: err.message };
    }
  }

  @Put('/')
  async update(@Body() body: Task) {
    try {
      const user = this.ctx.state.user as User;
      const task = await this.taskService.getTaskById(body.id);
      const projectId = task.project_id;
      await this.projectService.ensureValidProjectId(projectId, user, false);
      task.subject = body.subject;
      task.start_date = body.start_date;
      task.end_date = body.end_date;
      task.description = body.description;
      task.type = body.type;
      await this.taskService.update(task);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  @Post('/upload')
  async upload(@Files() files, @Fields() fields) {
    if (!files || files.length === 0) {
      this.ctx.throw(400, 'no files provided');
    }
    try {
      const uploadDir = this.ctx.app.getConfig('upload.baseDir');
      const file = files[0];
      const taskId = fields.task_id as number;
      const task = await this.taskService.getTaskById(taskId);
      const user = this.ctx.state.user;
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      const fileName = file.filename;
      const filePath = file.data;
      const targetPath = join(uploadDir, taskId.toString() + '-' + fileName);
      const record = await this.taskAttachmentService.create(
        fileName,
        targetPath,
        taskId
      );
      fs.copyFileSync(filePath, targetPath);
      console.log(record);
      return {
        success: true,
        value: file.filename,
      };
    } catch (err) {
      console.log(err);
      return { success: false, value: err.message };
    }
  }

  @Get('/upload')
  async getAllUpload(@Query('project_id') taskId: number) {
    try {
      const allUploads =
        await this.taskAttachmentService.getTaskAttachmentByTaskId(taskId);
      const response = allUploads.map(({ id, file_name }) => ({
        id,
        file_name,
      }));
      return { success: true, value: response };
    } catch (err) {
      console.log(err);
      return { success: false, value: err.message };
    }
  }

  @Del('/upload')
  async deleteFile(@Query('file_id') id: number) {
    try {
      const user = this.ctx.state.user as User;
      const file = await this.taskAttachmentService.getTaskAttachment(id);
      const taskId = file.task_id;
      const task = await this.taskService.getTaskById(taskId);
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      await this.taskAttachmentService.deleteTaskAttachment(file);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, value: err.message };
    }
  }

  @Get('/download')
  async downloadFile(
    @Query('file_name') file_name: string,
    @Query('project_id') project_id: number
  ) {
    try {
      const user = this.ctx.state.user as User;
      const task = await this.taskService.getTaskById(project_id);
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      const uploadDir = this.ctx.app.getConfig('upload.baseDir');
      const filePath = join(uploadDir, project_id.toString() + '-' + file_name);
      if (!existsSync(filePath)) {
        this.ctx.status = 404;
        this.ctx.body = 'File not found';
        return;
      }
      this.ctx.attachment(file_name);
      this.ctx.body = readFileSync(filePath);
    } catch (err) {
      console.log(err);
      this.ctx.status = 500;
    }
  }

  @Get('/comment')
  async getComments(@Query('task_id') taskId: number) {
    try {
      const user = this.ctx.state.user as User;
      const task = await this.taskService.getTaskById(taskId);
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      const comments = await this.taskCommentService.getCommentsByTaskId(
        taskId
      );
      return { success: true, value: comments };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  @Post('/comment')
  async addComment(@Body() body: { message: string; task_id: number }) {
    try {
      const username = this.ctx.state.user.username;
      const { message, task_id } = body;
      const comment = await this.taskCommentService.create(
        username,
        message,
        task_id
      );
      return { success: true, value: comment };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  @Del('/comment')
  async deleteComment(@Query('comment_id') id: number) {
    try {
      const user = this.ctx.state.user;
      const comment = await this.taskCommentService.getCommentById(id);
      if (comment.username !== user.username) {
        return { success: false };
      }
      const task = await this.taskService.getTaskById(comment.task_id);
      await this.projectService.ensureValidProjectId(
        task.project_id,
        user,
        false
      );
      await this.taskCommentService.deleteCommentById(id);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
}
