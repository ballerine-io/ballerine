import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInfo } from '../user/user-info';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login';
import { PasswordService } from './password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserInfo | null> {
    const user = await this.userService.getByEmailUnscoped(email);
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { id, firstName, lastName, roles } = user;
      const roleList = roles as string[];
      return { id, email, firstName, lastName, roles: roleList };
    }
    return null;
  }
}
