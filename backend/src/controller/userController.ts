import { UserService } from '../service/userService';
import {
  Body,
  Controller,
  Get,
  Inject,
  Options,
  Post,
  Provide,
} from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { User } from '../entity/User';
import { JwtPayload } from '../interface';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  jwtService: JwtService;

  @Inject()
  ctx: Context;

  async setUserToken(user: User) {
    const user_id = user.id;
    const login_time = Date.now();
    const token = await this.jwtService.sign({ user_id, login_time });
    await this.userService.updateLoginTime(user.id, login_time);
    this.ctx.cookies.set('token', token, { httpOnly: true }); // 设置 HTTP-only cookie
  }

  @Options('/*')
  async optionsHandler() {
    this.ctx.status = 204;
    const request_origin = this.ctx.request.headers.origin;
    this.ctx.set('Access-Control-Allow-Origin', request_origin);
    this.ctx.set(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    );
    this.ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  @Post('/register')
  async register(
    @Body() body: { username: string; password: string; email: string }
  ) {
    const { username, password, email } = body;
    try {
      await this.userService.register(username, password, email);
      return { success: true };
    } catch (error) {
      console.log('error');
      return { success: false, message: error.message };
    }
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    try {
      const user = await this.userService.getUserByPassword(username, password);
      await this.setUserToken(user);
      return { success: true, value: user.username };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('/reset-validate')
  async reset_validate(@Body() body: { username: string; email: string }) {
    const { username, email } = body;
    try {
      const user = await this.userService.getUserByEmail(username, email);
      await this.setUserToken(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('/reset-password')
  async reset_password(@Body() body: { password: string }) {
    const { password } = body;
    try {
      const user = this.ctx.state.user;
      await this.userService.updatePassword(user.id, password);
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  @Get('/verifyToken')
  async verifyToken() {
    const token = this.ctx.cookies.get('token');
    if (!token) {
      return { success: false, message: 'No token provided.' };
    }
    try {
      const userToken = (await this.jwtService.verify(
        token
      )) as unknown as JwtPayload;
      const user_id = userToken.user_id;
      const user = await this.userService.getUserById(user_id);
      if (user.login_time !== userToken.login_time) {
        return { success: false, message: 'Invalid token.' };
      }
      return { success: true, value: user.username };
    } catch (err) {
      console.log(err);
      return { success: false, message: 'Invalid token' };
    }
  }

  @Get('/logout')
  async logout() {
    try {
      const user = this.ctx.state.user;
      await this.userService.updateLoginTime(user.id, null);
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
}
