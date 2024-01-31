import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { Prisma, Alert } from '@prisma/client';

const mockDB = {
  AlertDefinitions: [
    {
      id: 1,
      projectId: 1,
      name: 'High Risk Transaction',
      description: 'Alert for transactions exceeding risk threshold',
      rulesetId: 101,
      ruleId: 201,
      inlineRule: {
        type: 'sql',
        sql: `
        SELECT 
    SUM(amount) AS total_incoming_amount
FROM 
    transactions
WHERE 
    transactionType = 'incoming'
    AND timestamp >= CURRENT_DATE - INTERVAL '7 days'  -- Set period of time (e.g., last 7 days)
HAVING 
    SUM(amount) > :limit  -- Replace :limit with the specific limit value
`,
      },
      createdAt: '2024-01-29T12:00:00Z',
      updatedAt: '2024-01-29T12:00:00Z',
      createdBy: 'adminUser',
      modifiedBy: 'adminUser',
      auditlog: [
        {
          timestamp: '2024-01-29T12:00:00Z',
          action: 'created',
          user: 'adminUser',
        },
      ],
      enabled: true,
      dedupeStrategies: {
        invokeOnce: true,
        invokeThrottleInSeconds: 60,
        resolveOnce: true,
        resolveOnceInSeconds: 3600,
      },
      config: {
        invokeWorkflow: false,
      },
      tags: ['high-risk', 'finance'],
      additionalInfo: {
        category: 'Risk Management',
        priorityLevel: 'High',
      },
      workflowDefinitionId: null,
    },
  ],
  AlertExecutions: [
    {
      id: 1001,
      businessId: 1,
      endUserId: 1,
      projectId: 1,
      dataTimestamp: '2024-01-29T13:00:00Z',
      state: 'triggered',
      status: 'pending',
      alertDefinitionId: 1,
      executionDetails: {
        triggerValues: {
          amount: 15000,
          transactionType: 'international',
        },
        result: 'pending review',
      },
      createdAt: '2024-01-29T13:30:00Z',
      updatedAt: '2024-01-29T13:45:00Z',
      handledBy: null,
      workflowRuntimeDataId: null,
    },
  ],
  AlertDefinitions2: [
    {
      id: 1,
      projectId: 1,
      name: 'High Risk Transaction',
      description: 'Alert for transactions exceeding risk threshold',
      staticData: {
        limit: 100,
        interval: '1d',
      },
      parametersSchema: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
          },
          transactionType: {
            type: 'string',
          },
        },
      },
      parametersSource: {
        sql: {
          amount: 'SELECT amount FROM transactions WHERE id = $1',
          transactionType: 'SELECT type FROM transactions WHERE id = $1',
          limit: 'SELECT limit FROM alert_definitions WHERE id = $1',
        },
        graphql: 'query($id: ID!) { transaction(id: $id) { amount, type } }',
      },
      rulesetId: 101,
      ruleId: 201,
      inlineRule: {
        type: 'sql',
        sql: `
        SELECT 
    SUM(amount) AS total_incoming_amount
FROM 
    transactions
WHERE 
    transactionType = 'incoming'
    AND timestamp >= CURRENT_DATE - INTERVAL '7 days'  -- Set period of time (e.g., last 7 days)
HAVING 
    SUM(amount) > :limit  -- Replace :limit with the specific limit value
`,
      },
      createdAt: '2024-01-29T12:00:00Z',
      updatedAt: '2024-01-29T12:00:00Z',
      createdBy: 'adminUser',
      modifiedBy: 'adminUser',
      auditlog: [
        {
          timestamp: '2024-01-29T12:00:00Z',
          action: 'created',
          user: 'adminUser',
        },
      ],
      enabled: true,
      strategies: {
        invokeOnce: true,
        invokeThrottleInSeconds: 60,
        resolveOnce: true,
        resolveOnceInSeconds: 3600,
      },
      tags: ['high-risk', 'finance'],
      additionalInfo: {
        category: 'Risk Management',
        priorityLevel: 'High',
      },
      workflowDefinitionId: null,
    },
  ],
  AlertExecutions: [
    {
      id: 1001,
      businessId: 1,
      endUserId: 1,
      projectId: 1,
      dataTimestamp: '2024-01-29T13:00:00Z',
      state: 'triggered',
      status: 'pending',
      alertDefinitionId: 1,
      executionDetails: {
        triggerValues: {
          amount: 15000,
          transactionType: 'international',
        },
        result: 'pending review',
      },
      createdAt: '2024-01-29T13:30:00Z',
      updatedAt: '2024-01-29T13:45:00Z',
      handledBy: null,
      workflowRuntimeDataId: null,
    },
  ],
};

@Injectable()
export class AlertRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  // Method to create an alert
  async create<T extends Prisma.AlertCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertCreateArgs>,
  ): Promise<Alert> {
    return await this.prisma.alert.create<T>(args);
  }

  // Method to find many alerts
  async findMany<T extends Prisma.AlertFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.AlertFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<Alert[]> {
    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);
    return await this.prisma.alert.findMany(queryArgs);
  }

  // Method to find a single alert by ID
  async findById<T extends Omit<Prisma.AlertFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<Alert> {
    const queryArgs = args as Prisma.AlertFindFirstOrThrowArgs;
    queryArgs.where = { ...queryArgs.where, id, projectId: { in: projectIds! } };
    return await this.prisma.alert.findFirstOrThrow(queryArgs);
  }

  // Method to update an alert by ID
  async updateById<T extends Omit<Prisma.AlertUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertUpdateArgs, 'where'>>,
  ): Promise<Alert> {
    return await this.prisma.alert.update({
      where: { id },
      ...args,
    });
  }

  // Method to delete an alert by ID
  async deleteById<T extends Omit<Prisma.AlertDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.AlertDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<Alert> {
    return await this.prisma.alert.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }
}
