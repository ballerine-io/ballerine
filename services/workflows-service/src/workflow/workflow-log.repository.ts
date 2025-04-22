import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WorkflowLog, WorkflowLogType } from '@prisma/client';
import { TProjectIds } from '@/types';

interface FindWorkflowLogsOptions {
  workflowRuntimeDataId?: string;
  types?: WorkflowLogType[];
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
  orderBy?: 'asc' | 'desc';
}

@Injectable()
export class WorkflowLogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findLogs(
    options: FindWorkflowLogsOptions,
    projectIds: TProjectIds,
  ): Promise<{ logs: WorkflowLog[]; total: number }> {
    const {
      workflowRuntimeDataId,
      types,
      fromDate,
      toDate,
      page = 1,
      pageSize = 50,
      orderBy = 'desc',
    } = options;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {};

    if (workflowRuntimeDataId) {
      where.workflowRuntimeDataId = workflowRuntimeDataId;
    }

    if (fromDate || toDate) {
      where.createdAt = {};

      if (fromDate) {
        where.createdAt.gte = fromDate;
      }

      if (toDate) {
        where.createdAt.lte = toDate;
      }
    }

    if (types && types.length > 0) {
      where.type = {
        in: types,
      };
    }

    if (projectIds && projectIds.length > 0) {
      where.projectId = {
        in: projectIds,
      };
    }

    const [total, logs] = await Promise.all([
      this.prismaService.workflowLog.count({ where }),
      this.prismaService.workflowLog.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: orderBy,
        },
      }),
    ]);

    return { logs, total };
  }

  async findLogsByWorkflowId(
    workflowRuntimeDataId: string,
    options: Omit<FindWorkflowLogsOptions, 'workflowRuntimeDataId'> = {},
    projectIds: TProjectIds,
  ): Promise<{ logs: WorkflowLog[]; total: number }> {
    return this.findLogs({ ...options, workflowRuntimeDataId }, projectIds);
  }

  async findLogsByType(
    type: WorkflowLogType,
    options: Omit<FindWorkflowLogsOptions, 'types'> = {},
    projectIds: TProjectIds,
  ): Promise<{ logs: WorkflowLog[]; total: number }> {
    return this.findLogs({ ...options, types: [type] }, projectIds);
  }

  async getLogSummary(
    workflowRuntimeDataId: string,
    projectIds: TProjectIds,
  ): Promise<Record<WorkflowLogType, number>> {
    const where: any = {
      workflowRuntimeDataId,
    };

    if (projectIds && projectIds.length > 0) {
      where.projectId = {
        in: projectIds,
      };
    }

    const counts = await this.prismaService.workflowLog.groupBy({
      by: ['type'],
      where,
      _count: true,
    });

    const summary = Object.values(WorkflowLogType).reduce(
      (acc, type) => ({
        ...acc,
        [type]: 0,
      }),
      {} as Record<WorkflowLogType, number>,
    );

    counts.forEach(count => {
      summary[count.type as WorkflowLogType] = count._count;
    });

    return summary;
  }
}
