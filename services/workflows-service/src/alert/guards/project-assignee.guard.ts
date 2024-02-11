import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TProjectIds } from '@/types';
import { UserService } from '@/user/user.service';
import { HttpExceptionFilter } from '@/common/filters/HttpExceptions.filter';
import { Prisma } from '@prisma/client';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
@UseGuards(HttpExceptionFilter)
export class ProjectAssigneeGuard implements CanActivate {
  constructor(private service: UserService, private logger: AppLoggerService) {}
  async canActivate(context: ExecutionContext) {
    // Should use Project decorator to get projectIds

    const request = context.switchToHttp().getRequest<Request>();

    let assigneeId: string | undefined;

    // Check if assigneeId exists in body, then query, then params
    if (request.body.assigneeId) {
      assigneeId = request.body.assigneeId;
    } else if (request.query.assigneeId && typeof request.query.assigneeId === 'string') {
      assigneeId = request.query.assigneeId;
    } else if (request.params.assigneeId) {
      assigneeId = request.params.assigneeId;
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
    } catch (error: unknown) {
      this.logger.error('Error while checking assignee using ProjectAssigneeGuard', { error });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id ${assigneeId} not found`);
        }
      }
    }

    return false;
  }
}
