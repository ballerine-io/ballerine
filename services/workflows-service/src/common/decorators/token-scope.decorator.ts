import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { WorkflowRuntimeDataToken } from '@prisma/client';

export type TokenScope = WorkflowRuntimeDataToken;

export const TokenScope = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return (request.tokenScope as TokenScope) || null;
});
