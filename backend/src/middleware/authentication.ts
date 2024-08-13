import { Inject, Middleware } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/userService';
import { JwtPayload } from '../interface';

@Middleware()
export class Authentication {
  @Inject()
  jwtService: JwtService;

  @Inject()
  userService: UserService;

  resolve() {
    return async (ctx: Context, next: () => Promise<any>) => {
      // 无需验证的路径列表
      const unprotectedPaths = [
        '/api',
        '/api/user/login',
        '/api/user/register',
        '/api/user/reset-validate',
        '/api/user/verifyToken',
      ];
      if (unprotectedPaths.includes(ctx.path) || ctx.method === 'OPTIONS') {
        await next();
        return;
      }
      const token = ctx.cookies.get('token');
      if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Not logged in.' };
        return;
      }

      try {
        const decoded_token = (await this.jwtService.verify(
          token
        )) as unknown as JwtPayload;
        const user = await this.userService.getUserById(decoded_token.user_id);
        if (decoded_token.login_time !== user.login_time) {
          ctx.status = 401;
          ctx.body = { message: 'token已过期.' };
        } else {
          ctx.state.user = user;
          await next();
        }
      } catch (err) {
        console.log(err);
        ctx.status = 401;
        ctx.body = { message: '无效的token.' };
      }
    };
  }
}
