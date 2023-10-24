import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';

/**
 * Expects a param named `id` in the request belonging to a workflow
 */
@Injectable()
export class WorkflowAssigneeGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    // @ts-expect-error `id` is not defined on `user`
    const requestingUserId = request.user!.user!.id;
    const workflowRuntime = await this.service.getWorkflowRuntimeDataById(
      workflowId as string,
      {
        include: {
          parentWorkflowRuntimeData: {
            select: {
              assigneeId: true,
            },
          },
        },
      },
      request.user!.projectIds,
    );

    return (
      workflowRuntime.assigneeId === requestingUserId ||
      workflowRuntime.parentWorkflowRuntimeData?.assigneeId === requestingUserId
    );
  }
}
