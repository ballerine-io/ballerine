import { PrismaService } from '../prisma/prisma.service';
import { alert, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

const mockDB = {
  AlertDefinitions: [
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
export class alertRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.alertCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.alertCreateArgs>,
  ): Promise<alert> {
    // #TODO: Fix this
    const { projectId, businessId, endUserId, ...rest } = args.data;

    args = {
      ...args,
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
      },
    } as any;

    if (businessId) {
      args.data.business = {
        connect: { id: businessId },
      } as any;
    }

    if (endUserId) {
      args.data.endUser = {
        connect: { id: endUserId },
      } as any;
    }
    const res = await this.prisma.alert.create<T>(args);
    return res;
  }

  // async get<T extends Prisma.alertCreateArgs>(
  //   args: Prisma.SelectSubset<T, Prisma.alertFindFirstOrThrowArgs>,
  // ): Promise<alert> {
  //   return this.prisma.alert.findFirstOrThrow<T>(args);
  // }

  // async findMany<T extends Prisma.alertFindManyArgs & { where: { projects: { some: { id: string } } } }>(
  //   projectId: string,
  //   args?: Prisma.SelectSubset<T, Prisma.alertFindManyArgs>,
  // ): Promise<alert[]> {
  //   return this.prisma.alert.findMany({
  //     where: { projects: { some: { id: projectId } } },
  //     ...args,
  //   });
  // }

  // async findById<T extends Omit<Prisma.alertFindUniqueOrThrowArgs, 'where'>, TProjectId>(
  //   id: string,
  //   projectId: TProjectId,
  //   args?: Prisma.SelectSubset<T, Omit<Prisma.alertFindUniqueOrThrowArgs, 'where'>>,
  // ): Promise<alert> {
  //   return this.prisma.alert.findUniqueOrThrow({
  //     where: { id, projects: { some: { id: projectId } } },
  //     ...args,
  //   });
  // }

  // async findByProjectId<T extends Omit<Prisma.alertFindFirstArgsBase, 'where'>>(
  //   projectId: string,
  //   args?: Prisma.SelectSubset<T, Omit<Prisma.alertFindFirstArgsBase, 'where'>>,
  // ): Promise<alert> {
  //   return this.prisma.alert.findFirstOrThrow({
  //     where: { projects: { some: { id: projectId } } },
  //     ...(args || {
  //       select: {
  //         id: true,
  //         name: true,
  //         displayName: true,
  //         logoImageUri: true,
  //         faviconImageUri: true,
  //         country: true,
  //         language: true,
  //         websiteUrl: true,
  //         projects: true,
  //       },
  //     }),
  //   });
  // }

  // async findByName<T extends Omit<Prisma.alertFindUniqueArgs, 'where'>>(
  //   projectId: string,
  //   name: string,
  //   args?: Prisma.SelectSubset<T, Omit<Prisma.alertFindUniqueArgs, 'where'>>,
  // ): Promise<any> {
  //   return this.prisma.alert.findUnique({
  //     where: { projects: { some: { id: projectId } }, name },
  //     ...args,
  //   });
  // }

  // async findByApiKey<TProjectId extends Omit<Prisma.alertFindFirstArgs, 'where'>>(
  //   projectId: TProjectId,
  //   apiKey: string,
  // ): Promise<alertWithProjects | null> {
  //   return this.prisma.alert.findFirst({
  //     where: {
  //       authenticationConfiguration: {
  //         authValue: apiKey,
  //       },
  //       projects: {
  //         some: {
  //           id: projectId,
  //         },
  //       },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       displayName: true,
  //       logoImageUri: true,
  //       faviconImageUri: true,
  //       alertStatus: true,
  //       country: true,
  //       language: true,
  //       projects: true,
  //     },
  //   });
  // }

  // async updateById<T extends Omit<Prisma.alertUpdateArgs, 'where'>>(
  //   id: string,
  //   args: Prisma.SelectSubset<T, Omit<Prisma.alertUpdateArgs, 'where'>>,
  // ): Promise<alert> {
  //   // @ts-expect-error - prisma json not updated
  //   await this.validateApiKey(args.data?.authenticationConfiguration?.authValue);

  //   return this.prisma.alert.update<T & { where: { id: string } }>({
  //     where: { id },
  //     ...args,
  //     data: {
  //       ...args.data,
  //     },
  //   });
  // }

  // async deleteById<T extends Omit<Prisma.alertDeleteArgs, 'where'>, TProjectId>(
  //   id: string,
  //   projectId: TProjectId,
  //   args?: Prisma.SelectSubset<T, Omit<Prisma.alertDeleteArgs, 'where'>>,
  // ): Promise<alert> {
  //   return this.prisma.alert.delete({
  //     where: { id, projects: { some: { id: projectId } } },
  //     ...args,
  //   });
  // }
}
