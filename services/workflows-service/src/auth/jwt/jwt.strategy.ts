import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthStrategy } from '../types';
import { UserInfo } from '../../user/user-info';
import { env } from '@/env';
import { Request } from 'express';

function extractJWT(req: Request): string | null {
  if (req.cookies && 'token' in req.cookies && req.cookies.user_token.length > 0) {
    return req.cookies.token;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) implements IAuthStrategy {
  constructor(protected readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserInfo): Promise<UserInfo> {
    const { id } = payload;
    const user = await this.userService.getByIdUnscoped(id, {});
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!Array.isArray(user.roles) || typeof user.roles !== 'object' || user.roles === null) {
      throw new Error('User roles is not a valid value');
    }
    return { ...user, roles: user.roles as string[] };
  }
}
