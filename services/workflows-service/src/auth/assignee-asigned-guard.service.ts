import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import { WorkflowRuntimeData } from '@prisma/client';
import console from 'console';

@Injectable()
export class AssigneeAsignedGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    const requestingUserId = request.user!.id;
    const workflowRuntime = await this.service.getWorkflowRuntimeDataById(workflowId as string);

    return workflowRuntime.assigneeId === requestingUserId;
  }
}
