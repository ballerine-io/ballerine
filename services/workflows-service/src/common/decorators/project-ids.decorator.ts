import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProjectIds = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest(); // fetch payload project if present
  return request.user?.projectIds;
});
