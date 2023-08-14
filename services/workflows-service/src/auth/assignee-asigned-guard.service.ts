import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';
import { env } from '@/env';

/**
 * Expects a param named `id` in the request belonging to a workflow
 */
@Injectable()
export class WorkflowAssigneeGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    console.log('IS DEMO', env.IS_DEMO);
    if (env.IS_DEMO) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    const requestingUserId = request.user!.id;
    const workflowRuntime = await this.service.getWorkflowRuntimeDataById(workflowId as string);

    return workflowRuntime.assigneeId === requestingUserId;
  }
}
