import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedEntity } from '@/types';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as AuthenticatedEntity;

    if (user?.type !== 'customer') {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
