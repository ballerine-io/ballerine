import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IAuthStrategy } from '@/auth/types';
import { UserInfo } from '@/user/user-info';
import { env } from '@/env';
import { AuthService } from '../auth.service';

@Injectable()
export class MagicLinkStrategy
  extends PassportStrategy(Strategy, 'magic-link')
  implements IAuthStrategy
{
  constructor(protected readonly authService: AuthService) {
    super({
      secretOrKey: env.MAGIC_LINK_AUTH_JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      algorithms: env.MAGIC_LINK_AUTH_JWT_ALGORITHMS.split(','),
    });
  }

  async validate(payload: { sub?: string } = {}): Promise<UserInfo> {
    // Fail-fast as we can't have users with empty/null id
    if (!payload.sub) {
      throw new UnauthorizedException('Empty user id');
    }

    const user = await this.authService.authenticateUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
