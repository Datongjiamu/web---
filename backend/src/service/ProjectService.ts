import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/Project';
import { User } from '../entity/User';

@Provide()
export class ProjectService {
  @InjectEntityModel(Project)
  projectRepository: Repository<Project>;

  async ensureValidProjectId(projectId: number, user: User, strict: boolean) {
    const user_id = user.id;
    if (!(await this.checkProject(user_id, projectId))) {
      if (strict || user.collaborate === null)
        throw Error('Project id not valid');
      for (const involve_id of user.collaborate) {
        if (Number(involve_id) === projectId) return;
      }
      throw Error('Project id not valid');
    }
  }

  async getTasks(task_ids: number[]): Promise<Project[]> {
    if (task_ids === null || task_ids.length === 0) return [];
    const tasks = [] as Project[];
    for (const id of task_ids) {
      tasks.push(await this.getTask(id));
    }
    return tasks;
  }

  async getTask(task_id: number): Promise<Project> {
    return this.projectRepository.findOneBy({ id: task_id });
  }

  async getTaskByUserId(user_id: number): Promise<Project[]> {
    return this.projectRepository.find({ where: { owner: user_id } });
  }

  async create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async delete(task_id: number): Promise<void> {
    const task = await this.projectRepository.findOneBy({ id: task_id });
    await this.projectRepository.remove(task);
  }

  async checkProject(user_id: number, task_id: number): Promise<boolean> {
    try {
      const task = await this.getTask(task_id);
      return !(!task || task.owner !== user_id);
    } catch (err) {
      return false;
    }
  }
}
