import { Controller, Get } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  async homeRoot(): Promise<string> {
    return '欢迎使用看板系统';
  }
}
