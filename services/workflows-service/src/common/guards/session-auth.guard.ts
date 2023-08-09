import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DISABLE_SESSION_AUTH } from '@/common/disable-session-auth';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(DISABLE_SESSION_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    if (!req.isAuthenticated()) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
