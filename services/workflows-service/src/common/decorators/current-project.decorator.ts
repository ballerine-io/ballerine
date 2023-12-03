import type { AuthenticatedEntityWithProjects, TProjectId } from '@/types';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { z } from 'zod';

const RequestedProjectIdSchema = z.string().optional();

export const CurrentProject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TProjectId => {
    const request = ctx.switchToHttp().getRequest(); // fetch payload project if present
    const authenticatedEntity = request.user as AuthenticatedEntityWithProjects;
    const userAssociatedProjectIds = authenticatedEntity.projectIds;
    const requestedProjectId = RequestedProjectIdSchema.parse(
      request.payload?.projectId || request.query?.projectId,
    );

    const isUnauthorizedProjectId =
      !!requestedProjectId && !userAssociatedProjectIds?.includes(requestedProjectId);
    const notAdmin = !(authenticatedEntity.type === 'admin');

    if (isUnauthorizedProjectId && notAdmin) {
      throw new UnauthorizedException(
        `Requested projectId ${requestedProjectId} is not associated with ${
          authenticatedEntity.type
        } ${authenticatedEntity.user?.id || authenticatedEntity.customer?.id || 'Admin'}`,
      );
    }

    // TODO: remove optional userAssociatedProjectIds after MT finalize merge
    return (requestedProjectId || userAssociatedProjectIds?.[0]) as TProjectId;
  },
);
