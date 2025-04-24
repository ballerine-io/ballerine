import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DISABLE_SESSION_AUTH } from '@/common/disable-session-auth';
import { AuthenticatedEntity } from '@/types';

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

    const authenticatedEntity = req.user as AuthenticatedEntity | undefined;

    if (
      req.isAuthenticated() ||
      !!authenticatedEntity?.customer ||
      authenticatedEntity?.type == 'admin'
    ) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
