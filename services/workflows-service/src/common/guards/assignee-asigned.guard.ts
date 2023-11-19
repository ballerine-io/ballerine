import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';
import type { TProjectIds } from '@/types';

@Injectable()
export class WorkflowAssigneeGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    // @ts-expect-error `id` is not defined on `user`
    const requestingUserId = request.user!.id;
    const workflowRuntime = await this.service.getWorkflowRuntimeDataById(
      workflowId as string,
      {},
      (request.user as any)?.projectIds as TProjectIds,
    );

    return workflowRuntime.assigneeId === requestingUserId;
  }
}
