import { WorkflowRuntimeDataToken } from '@prisma/client';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type ITokenScope = WorkflowRuntimeDataToken;

export type ITokenScopeWithEndUserId = Omit<WorkflowRuntimeDataToken, 'endUserId'> & {
  endUserId: string;
};

export const TokenScope = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return (request.tokenScope as ITokenScope) || null;
});
