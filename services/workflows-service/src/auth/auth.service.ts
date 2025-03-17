import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { UserInfo } from '@/user/user-info';
import { UserService } from '@/user/user.service';
import { PasswordService } from './password/password.service';
import type { JsonValue } from 'type-fest';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async authenticateUserById(userId: string): Promise<UserInfo | null> {
    const user = await this.userService.getByIdUnscoped(userId, {
      select: {
        email: true,
        status: true,
        id: true,
        firstName: true,
        lastName: true,
        roles: true,
      },
    });

    if (user) {
      return this.processUserAuthentication(user, user.email);
    }

    return null;
  }

  async authenticateUserByPassword(email: string, password: string): Promise<UserInfo | null> {
    const user = await this.userService.getByEmailUnscoped(email);

    if (user && (await this.passwordService.compare(password, user.password))) {
      return this.processUserAuthentication(user, email);
    }

    return null;
  }

  private processUserAuthentication = (
    user: { status: UserStatus; id: string; firstName: string; lastName: string; roles: JsonValue },
    email: string,
  ) => {
    if (user?.status !== UserStatus.Active) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { id, firstName, lastName, roles } = user;
    const roleList = roles as string[];

    return { id, email, firstName, lastName, roles: roleList };
  };
}
