import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';

@Injectable()
export class WorkflowAssigneeGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    const requestingUserId = request.user!.id;
    const workflowRuntimeData = await this.service.getWorkflowRuntimeDataById(workflowId as string);

    if (!workflowRuntimeData) {
      throw new NotFoundException(
        `Workflow runtime data with an id of "${workflowId as string}" not found`,
      );
    }

    return workflowRuntimeData.assigneeId === requestingUserId;
  }
}
