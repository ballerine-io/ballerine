import { TProjectId } from '@/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentProject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TProjectId => {
    const request = ctx.switchToHttp().getRequest(); // fetch payload project if present
    return request.user?.projectIds[0] ?? null;
  },
);
