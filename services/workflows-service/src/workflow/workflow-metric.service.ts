import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { UserService } from '@/user/user.service';
import {
  GetWorkflowRuntimeCasesPerStatusParams,
  ListWorkflowRuntimeAgentCasesStatsParams,
  WorkflowDefinitionStats,
  WorkflowRuntimeAgentStats,
  WorkflowRuntimeCasesPerStatus,
} from '@/workflow/types';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { Injectable } from '@nestjs/common';
import uniq from 'lodash/uniq';
import keyBy from 'lodash/keyBy';

@Injectable()
export class WorkflowMetricService {
  constructor(
    protected readonly userService: UserService,
    protected readonly logger: AppLoggerService,
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
  ) {}

  async getWorkflowsRuntimeCasesPerStatus(
    params: GetWorkflowRuntimeCasesPerStatusParams = {},
  ): Promise<WorkflowRuntimeCasesPerStatus> {
    const queryResult = await this.workflowRuntimeDataRepository.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          ...(params.fromDate ? { gte: params.fromDate } : undefined),
        },
      },
      _count: true,
    });

    const metrics: WorkflowRuntimeCasesPerStatus = {
      active: 0,
      failed: 0,
      completed: 0,
    };

    queryResult.forEach(metric => {
      metrics[metric.status] = Number(metric._count) || 0;
    });

    return metrics;
  }

  async listWorkflowStats(): Promise<WorkflowDefinitionStats[]> {
    const countByStatusList = await this.workflowRuntimeDataRepository.groupBy({
      by: ['workflowDefinitionId', 'status'],
      _count: {
        status: true,
      },
    });

    const workflowDefinitionIds = countByStatusList.map(stats => stats.workflowDefinitionId);
    const workflowDefinitions = await this.workflowDefinitionRepository.findMany({
      where: {
        id: {
          in: uniq(workflowDefinitionIds),
        },
      },
    });

    const workflowDefinitionsById = keyBy(workflowDefinitions, 'id');

    const workflowDefinitionsStats = countByStatusList.reduce(
      (statsById, workflowDefinitionStats) => {
        const { workflowDefinitionId } = workflowDefinitionStats;
        const stats: WorkflowDefinitionStats = {
          ...statsById[workflowDefinitionId],
          id: workflowDefinitionId,
          name: String(workflowDefinitionsById[workflowDefinitionId]?.name),
          stats: {
            active: 0,
            failed: 0,
            completed: 0,
            ...statsById[workflowDefinitionId]?.stats,
            [workflowDefinitionStats.status]: Number(
              (workflowDefinitionStats._count as any).status,
            ),
          },
        };

        statsById[workflowDefinitionId] = stats;

        return statsById;
      },
      {} as Record<string, WorkflowDefinitionStats>,
    );

    return Object.values(workflowDefinitionsStats);
  }

  async listWorkflowRuntimeAgentCasesStats(
    params: ListWorkflowRuntimeAgentCasesStatsParams = {},
  ): Promise<WorkflowRuntimeAgentStats[]> {
    console.log({ gte: params.fromDate });

    const casesCountList = await this.workflowRuntimeDataRepository.groupBy({
      by: ['assigneeId'],
      where: {
        assigneeId: {
          not: null,
        },
        assignedAt: {
          ...(params.fromDate ? { gte: params.fromDate } : { not: null }),
        },
      },
      _count: true,
    });

    const agentIds = casesCountList.map(count => count.assigneeId);
    const agents = await this.userService.list({ where: { id: { in: agentIds as string[] } } });
    const agentsMapById = keyBy(agents, 'id');

    return casesCountList.map(caseCount => {
      const { _count, assigneeId } = caseCount;
      const agentId = String(assigneeId);
      const agent = agentsMapById[agentId];

      const agentStats: WorkflowRuntimeAgentStats = {
        id: agentId,
        firstName: String(agent?.firstName),
        lastName: String(agent?.lastName),
        casesCount: Number(_count) || 0,
      };

      return agentStats;
    });
  }
}
