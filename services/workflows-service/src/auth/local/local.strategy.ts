import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IAuthStrategy } from '@/auth/types';
import { UserInfo } from '@/user/user-info';
import { JwtAuthService } from '../jwt/jwt.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements IAuthStrategy {
  constructor(
    protected readonly authService: AuthService,
    private readonly jwtAuthService: JwtAuthService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserInfo> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.jwtAuthService.signPayload({ user });
    return { accessToken, ...user };
  }
}
