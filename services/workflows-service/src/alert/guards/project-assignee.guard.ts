import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { TProjectIds } from '@/types';
import { UserService } from '@/user/user.service';
import { HttpExceptionFilter } from '@/common/filters/HttpExceptions.filter';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as errors from '../../errors';

@Injectable()
@UseGuards(HttpExceptionFilter)
export class ProjectAssigneeGuard implements CanActivate {
  constructor(private service: UserService, private logger: AppLoggerService) {}
  async canActivate(context: ExecutionContext) {
    // Should use Project decorator to get projectIds

    const request = context.switchToHttp().getRequest<Request>();

    let assigneeId: string | undefined | null;

    // Check if assigneeId exists in body, then query, then params
    if (request.body.assigneeId !== undefined) {
      assigneeId = request.body.assigneeId;
    } else if (request.query.assigneeId && typeof request.query.assigneeId === 'string') {
      assigneeId = request.query.assigneeId;
    } else if (request.params.assigneeId) {
      assigneeId = request.params.assigneeId;
    }

    if (assigneeId === null) {
      return true;
    }

    if (!assigneeId) {
      this.logger.warn('Assignee id not found in request');

      return false;
    }

    try {
      const user = await this.service.getById(
        assigneeId,
        {},
        (request.user as any)?.projectIds as TProjectIds,
      );

      return Boolean(user);
    } catch (error) {
      this.logger.error('Error while checking assignee using ProjectAssigneeGuard', { error });

      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`User with id ${assigneeId} not found`);
      }
    }

    return false;
  }
}
