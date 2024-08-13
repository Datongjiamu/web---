import { App, Configuration } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import * as cors from '@koa/cors';
import * as jwt from '@midwayjs/jwt';

import { join } from 'path';
import { Monitor } from './middleware/monitor';
import { Authentication } from './middleware/authentication';
import * as upload from '@midwayjs/upload';
import * as fs from 'node:fs';
import { NotFoundFilter } from './filter/notFoundFilter';
import { DefaultErrorFilter } from './filter/defaultFilter';

@Configuration({
  imports: [
    koa,
    validate,
    typeorm,
    jwt,
    cors,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // 添加中间件
    this.app.useMiddleware([Monitor, Authentication]);
    this.app.use(
      cors({
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH', // 设置允许的HTTP请求类型
        credentials: true,
        origin: '*',
      })
    );
    const uploadPath = this.app.getConfig('upload.baseDir');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
