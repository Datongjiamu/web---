import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

@Scope(ScopeEnum.Request, { allowDowngrade: true })
@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepository: Repository<User>;

  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  async getUserByPassword(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) throw Error('User not found');
    const result = await bcrypt.compare(password, user.password);
    if (!result) throw Error('Password incorrect.');
    return user;
  }

  async getUserById(user_id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) throw Error('User does not exist');
    return user;
  }

  async getUserByEmail(username: string, email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user || user.username !== username) throw Error('User not found');
    return user;
  }

  async updatePassword(user_id: number, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.userRepository.update(user_id, { password: hashedPassword });
  }

  async updateLoginTime(user_id: number, login_time: number): Promise<void> {
    await this.userRepository.update(user_id, { login_time: login_time });
  }

  async register(
    username: string,
    password: string,
    email: string
  ): Promise<User> {
    const newUser = new User();
    const hashedPassword = await this.hashPassword(password);
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.email = email;
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        if (error.message.includes('UNIQUE constraint failed: User.email')) {
          throw new Error('邮箱已存在');
        }
      }
      throw error;
    }
  }

  async addCollaborate(email: string, projectId: number, user: User) {
    const target_user = await this.userRepository.findOneBy({ email: email });
    if (!target_user) throw Error('用户不存在!');
    if (target_user.id === user.id) throw Error('不能添加自己!');
    if (target_user.collaborate === null) target_user.collaborate = [];
    target_user.collaborate.push(projectId);
    await this.userRepository.save(target_user);
  }
}
