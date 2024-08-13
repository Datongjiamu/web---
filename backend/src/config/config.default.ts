import { MidwayAppInfo } from '@midwayjs/core';
import { join } from 'path';
import { User } from '../entity/User';
import { Task } from '../entity/Task';
import { Project } from '../entity/Project';
import { uploadWhiteList } from '@midwayjs/upload';
import { tmpdir } from 'node:os';
import { TaskAttachment } from '../entity/TaskAttachment';
import { TaskComments } from '../entity/TaskComments';

export default (appInfo: MidwayAppInfo) => {
  return {
    keys: '1723428746809_1978',
    koa: {
      port: 7001,
      globalPrefix: '/api',
    },
    typeorm: {
      dataSource: {
        default: {
          type: 'sqlite',
          database: join(__dirname, '../../kanban_db.sqlite'),
          synchronize: true,
          entities: [User, Project, Task, TaskAttachment, TaskComments],
          logging: false,
        },
      },
    },
    jwt: {
      secret: 'xiaoming11223344',
      sign: {
        // signOptions
        expiresIn: '1d',
      },
    },
    upload: {
      // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
      mode: 'file',
      // fileSize: string, 最大上传文件大小，默认为 10mb
      fileSize: '10mb',
      // whitelist: string[]，文件扩展名白名单
      whitelist: uploadWhiteList,
      // tmpdir: string，上传的文件临时存储路径
      tmpdir: join(tmpdir(), 'midway-upload-files'),
      // 上传文件的基目录
      baseDir: join(__dirname, '../../uploads'),
      // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
      cleanTimeout: 5 * 60 * 1000,
      // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
      base64: false,
      // 仅在匹配路径到 /api/project/upload 的时候去解析 body 中的文件信息
      match: /\/api\/project\/upload/,
    },
  };
};
