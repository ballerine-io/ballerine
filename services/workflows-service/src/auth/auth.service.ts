import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInfo } from '../user/user-info';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login';
import { PasswordService } from './password/password.service';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserInfo | null> {
    const user = await this.userService.getByUsername(username);
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { id, roles } = user;
      const roleList = roles as string[];
      return { id, username, roles: roleList };
    }
    return null;
  }

  async login(credentials: LoginDto): Promise<UserInfo> {
    const { username, password } = credentials;
    const user = await this.validateUser(credentials.username, credentials.password);
    if (!user) {
      throw new UnauthorizedException('The passed credentials are incorrect');
    }

    const accessToken = await this.tokenService.createToken({
      id: user.id,
      username,
      password,
    });

    return {
      accessToken,
      ...user,
    };
  }
}
