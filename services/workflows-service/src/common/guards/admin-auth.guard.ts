import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedEntity } from '@/types';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as AuthenticatedEntity | undefined;

    if (user?.type !== 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
