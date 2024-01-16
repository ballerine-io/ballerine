import { ClsService } from 'nestjs-cls';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

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

    const tokenEntity = await this.tokenService.findByToken(token);

    if (!tokenEntity) {
      throw new UnauthorizedException('Unauthorized');
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
