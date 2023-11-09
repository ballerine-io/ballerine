import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedEntityWithProjects } from '@/types';
import { z } from 'zod';

const RequestedProjectIdSchema = z.array(z.string()).optional();
export const ProjectIds = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest(); // fetch payload project if present

  const authenticatedEntity = request.user as AuthenticatedEntityWithProjects;
  const userAssociatedProjectIds = authenticatedEntity.projectIds!;
  const requestedProjectIds = RequestedProjectIdSchema.parse(request.query.projectIds);

  const isUnauthorizedProjectIds =
    !!requestedProjectIds &&
    requestedProjectIds.length > 0 &&
    !requestedProjectIds.some(projectId => !userAssociatedProjectIds.includes(projectId));
  const notAdmin = !(authenticatedEntity.type === 'admin');

  if (isUnauthorizedProjectIds && notAdmin) {
    throw new UnauthorizedException(
      `Requested projectId ${userAssociatedProjectIds.join(',')} is not associated with ${
        authenticatedEntity.type
      } ${
        authenticatedEntity.user?.id ||
        authenticatedEntity.customer?.id ||
        userAssociatedProjectIds.join(',')
      }`,
    );
  }

  return requestedProjectIds || request.user?.projectIds;
});
