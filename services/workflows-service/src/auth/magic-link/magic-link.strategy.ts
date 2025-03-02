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
      secretOrKey: env.MAGIC_LINK_JWT,
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
    });
  }

  async validate(payload: { sub: string }): Promise<UserInfo> {
    const user = await this.authService.validateUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
