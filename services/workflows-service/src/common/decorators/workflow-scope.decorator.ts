import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IWorkflowScope {
  workflowRuntimeDataId: string;
  projectId: string;
}

export const WorkflowScope = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return (request.workflowScope as IWorkflowScope) || null;
});
