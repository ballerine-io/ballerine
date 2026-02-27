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

    const authenticatedEntity = req.user as AuthenticatedEntity & { projectIds?: TProjectIds };

    const isSessionAuthenticated =
      req.isAuthenticated() ||
      !!authenticatedEntity?.customer ||
      authenticatedEntity?.type === 'admin';

    const workflowId =
      typeof req.query['workflowId'] === 'string' && req.query['workflowId'] !== 'null'
        ? req.query['workflowId']
        : null;

    return isSessionAuthenticated && workflowId
      ? await this.checkWorkflowIdAuthentication(workflowId, authenticatedEntity, context)
      : await this.checkTokenAuthentication(context);
  }

  private async checkWorkflowIdAuthentication(
    workflowId: string,
    authenticatedEntity: AuthenticatedEntity & {
      projectIds?: string[] | null | undefined;
    },
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest<Request>();

    // Validate UUID format before querying Prisma — the workflow.id column is UUID type.
    // Without this check, malformed workflow IDs cause a Prisma 500 instead of a clean 401.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(workflowId)) {
      throw new UnauthorizedException('Invalid Workflow ID format');
    }

    const workflow = await this.workflowService.getWorkflowRuntimeDataById(
      workflowId,
      {},
      authenticatedEntity?.projectIds || [],
    );

    if (!workflow) {
      throw new UnauthorizedException('Invalid Workflow ID');
    }

    this.cls.set('entity', {
      user: authenticatedEntity.user,
      type: 'user',
    });

    // Defense-in-depth: if the database has a corrupted token UUID, Prisma crashes
    // when deserializing the row. Catch and continue with null tokenScope instead
    // of failing the entire request with a 500.
    try {
      (req as any).tokenScope =
        await this.workflowTokenService.findFirstByWorkflowRuntimeDataIdUnscoped(workflow.id);
    } catch (error) {
      console.warn(
        `[WorkflowAuthGuard] Failed to resolve tokenScope for workflow ${workflow.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      (req as any).tokenScope = null;
    }

    return true;
  }

  private async checkTokenAuthentication(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token || token === 'null') {
      throw new UnauthorizedException('Unauthorized');
    }

    // Validate UUID format before querying Prisma — the token column is UUID type.
    // Without this check, malformed tokens cause a Prisma 500 instead of a clean 401.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(token)) {
      throw new UnauthorizedException('Invalid token format');
    }

    // Defense-in-depth: wrap Prisma query so corrupted DB rows cause a clean 401,
    // not a 500. Prisma may crash if the token column in the result is a malformed UUID.
    let tokenEntity;

    try {
      tokenEntity = await this.workflowTokenService.findByTokenWithExpiredUnscoped(token);
    } catch (error) {
      console.error(
        `[WorkflowAuthGuard] Prisma error looking up token: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new UnauthorizedException('Token lookup failed');
    }

    if (!tokenEntity) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!tokenEntity.endUserId) {
      throw new UnauthorizedException('No EndUser is set for this token');
    }

    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired');
    }

    // Cross-validate: ensure the workflow referenced by this token belongs to the token's project.
    // This is a defense-in-depth check — the token itself is unguessable (122-bit UUID),
    // but we verify project ownership to guard against data corruption or token table manipulation.
    if (tokenEntity.projectId && tokenEntity.workflowRuntimeDataId) {
      const workflow = await this.workflowService.getWorkflowRuntimeDataById(
        tokenEntity.workflowRuntimeDataId,
        {},
        [tokenEntity.projectId],
      );

      if (!workflow) {
        throw new UnauthorizedException('Token references a workflow outside its project scope');
      }
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
