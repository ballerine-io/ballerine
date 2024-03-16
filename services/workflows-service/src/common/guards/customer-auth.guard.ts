import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedEntity } from '@/types';
import { AppLoggerService } from '../app-logger/app-logger.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(protected readonly logger: AppLoggerService) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as AuthenticatedEntity;

    if (user?.type !== 'customer') {
      this.logger.error('Unauthorized request', {
        user,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
