import type { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(
    protected readonly tokenService: WorkflowTokenService,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const tokenEntity = await this.tokenService.findByTokenWithExpiredUnscoped(token);

    if (!tokenEntity) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!tokenEntity.endUserId) {
      throw new UnauthorizedException('No EndUser is set for this token');
    }

    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired');
    }

    this.cls.set('entity', {
      endUser: {
        workflowRuntimeDataId: tokenEntity.workflowRuntimeDataId,
        endUserId: tokenEntity.endUserId,
        id: tokenEntity.id,
      },
      type: 'endUser',
    });

    (req as any).tokenScope = tokenEntity;

    return true;
  }
}
