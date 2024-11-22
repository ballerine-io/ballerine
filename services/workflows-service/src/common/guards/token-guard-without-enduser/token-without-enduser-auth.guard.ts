import type { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';

@Injectable()
export class TokenWithoutEnduserAuthGuard implements CanActivate {
  constructor(protected readonly tokenService: WorkflowTokenService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const tokenEntity = await this.tokenService.findByTokenWithExpiredUnscoped(token);

    if (!tokenEntity || tokenEntity.endUserId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired');
    }

    (req as any).tokenScope = tokenEntity;

    return true;
  }
}
