import type { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedEntity, TProjectIds } from '@/types';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    protected readonly tokenService: WorkflowTokenService,
    protected readonly workflowService: WorkflowService,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const workflowId = req.params['wf-id'] || req.query['wf-id'];

    const authenticatedEntity = req.user as AuthenticatedEntity & { projectIds?: TProjectIds };

    if (
      req.isAuthenticated() ||
      !!authenticatedEntity?.customer ||
      authenticatedEntity?.type === 'admin'
    ) {
      if (workflowId) {
        const workflow = await this.workflowService.getWorkflowRuntimeDataById(
          workflowId as string,
          {},
          authenticatedEntity?.projectIds || [],
        );

        if (!workflow) {
          throw new UnauthorizedException('Invalid workflow ID');
        }

        (req as any).workflowScope = {
          workflowRuntimeDataId: workflow.id,
          projectId: workflow.projectId,
        };
      }

      return true;
    }

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
