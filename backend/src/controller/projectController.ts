import { Body, Controller, Del, Get, Inject, Post, Query } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { ProjectService } from "../service/ProjectService";
import { JwtService } from "@midwayjs/jwt";
import { User } from "../entity/User";
import { TaskService } from "../service/TaskService";
import { UserService } from "../service/userService";
import { Project } from "../entity/Project";

@Controller('/project')
export class ProjectController {
  @Inject()
  ctx: Context;

  @Inject()
  projectservice: ProjectService;

  @Inject()
  jwtService: JwtService;

  @Inject()
  oldprojectservice: TaskService;

  @Inject()
  userService: UserService;

  @Post('/')
  async create(@Body() body: { name: string }) {
    try {
      const user_id = this.ctx.state.user.id;
      const project = new Project();
      project.name = body.name;
      project.owner = user_id;
      project.create_time = Date.now();
      const newProject = await this.projectservice.create(project);
      return { success: true, value: newProject };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @Del('/')
  async delete(@Query('project_id') projectId: number) {
    try {
      const user = this.ctx.state.user as User;
      const user_id = user.id;
      const checkVal = await this.projectservice.checkProject(
        user_id,
        projectId
      );
      if (checkVal) {
        await this.oldprojectservice.deleteTaskByProjectId(projectId);
        await this.projectservice.delete(projectId);
        return { success: true };
      } else {
        return { success: false, message: '无法删除此项目' };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @Get('/')
  async getAll() {
    try {
      const user = this.ctx.state.user as User;
      const created_tasks = await this.projectservice.getTaskByUserId(user.id);
      const involved_tasks = await this.projectservice.getTasks(
        user.collaborate
      );
      const real_created_tasks = created_tasks.map(task => {
        return { ...task, type: 0 };
      });
      const real_involved_tasks = involved_tasks.map(task => {
        return { ...task, type: 1 };
      });
      this.ctx.body = {
        success: true,
        value: real_created_tasks.concat(real_involved_tasks),
      };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @Post('/collaborate')
  async addCollaborate(@Body() body: { email: string; project_id: number }) {
    try {
      const { email, project_id } = body;
      const user = this.ctx.state.user as User;
      await this.projectservice.ensureValidProjectId(project_id, user, true);
      await this.userService.addCollaborate(email, project_id, user);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, message: err.message };
    }
  }
}
