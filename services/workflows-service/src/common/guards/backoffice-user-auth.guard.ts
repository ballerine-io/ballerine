import { AuthenticatedEntity } from '@/types';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

const ALLOWED_BACKOFFICE_ROLES = new Set(['admin', 'operator', 'reviewer']);

@Injectable()
export class BackofficeUserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authenticatedEntity = req.user as AuthenticatedEntity | undefined;

    if (!authenticatedEntity) {
      throw new ForbiddenException('Forbidden');
    }

    if (authenticatedEntity.type === 'admin') {
      return true;
    }

    if (authenticatedEntity.type !== 'user') {
      throw new ForbiddenException('Forbidden');
    }

    const roles = (authenticatedEntity.user as { roles?: unknown } | undefined)?.roles;

    if (!Array.isArray(roles)) {
      throw new ForbiddenException('Forbidden');
    }

    const hasAllowedRole = roles.some(
      role => typeof role === 'string' && ALLOWED_BACKOFFICE_ROLES.has(role.trim().toLowerCase()),
    );

    if (!hasAllowedRole) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
