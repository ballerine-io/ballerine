import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import { WorkflowRuntimeData } from '@prisma/client';

@Injectable()
export class AssigneeAsignedGuard implements CanActivate {
  constructor(private service: WorkflowService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const workflowId = request.params.id;
    const workflowDefinitionUdateInput = request.body as WorkflowDefinitionUpdateInput;

    const requestingUserId = request.user!.id;
    const workflowRuntime = await this.service.getWorkflowRuntimeDataById(workflowId as string);
    if (!this._decisionUpdated(workflowDefinitionUdateInput, workflowRuntime)) return true;

    return workflowRuntime.assigneeId === requestingUserId;
  }

  private _decisionUpdated(
    workflowDefinitionUdateInput: WorkflowDefinitionUpdateInput,
    workflowRuntime: WorkflowRuntimeData,
  ) {
    // @ts-ignore
    return workflowRuntime.context.documents.every((docuemnt, index) => {
      return workflowDefinitionUdateInput.context.documents[index]?.desition === docuemnt.desition;
    });
  }
}
