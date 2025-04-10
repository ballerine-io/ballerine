import type { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedEntity, TProjectIds } from '@/types';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';

@Injectable()
export class WorkflowAuthGuard implements CanActivate {
  constructor(
    private readonly cls: ClsService,
    private readonly workflowService: WorkflowService,
    private readonly workflowTokenService: WorkflowTokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const workflowId =
      typeof req.params['workflowId'] === 'string' && req.params['workflowId'] !== 'null'
        ? req.params['workflowId']
        : null;

    const authenticatedEntity = req.user as AuthenticatedEntity & { projectIds?: TProjectIds };

    if (
      !(
        req.isAuthenticated() ||
        !!authenticatedEntity?.customer ||
        authenticatedEntity?.type === 'admin'
      ) ||
      !workflowId
    ) {
      throw new UnauthorizedException('Unauthorized');
    }

    const workflow = await this.workflowService.getWorkflowRuntimeDataById(
      workflowId,
      {},
      authenticatedEntity?.projectIds || [],
    );

    if (!workflow) {
      throw new UnauthorizedException('Invalid workflow ID');
    }

    this.cls.set('entity', {
      user: authenticatedEntity.user,
      type: 'user',
    });

    (req as any).tokenScope =
      await this.workflowTokenService.findFirstByWorkflowRuntimeDataIdUnscoped(workflow.id);

    return true;
  }
}
