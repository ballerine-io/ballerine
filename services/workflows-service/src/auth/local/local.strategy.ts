import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IAuthStrategy } from '@/auth/types';
import { UserInfo } from '@/user/user-info';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements IAuthStrategy {
  constructor(protected readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserInfo> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
