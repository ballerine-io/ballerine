import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { isFkConstraintError } from '@/prisma/prisma.util';
import { ObjectValues, TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import { Alert, AlertDefinition, AlertState, AlertStatus, Prisma } from '@prisma/client';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { InlineRule } from '@/data-analytics/types';
import _ from 'lodash';

// TODO: move to utils

@Injectable()
export class AlertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly dataAnalyticsService: DataAnalyticsService,
    private readonly alertRepository: AlertRepository,
    private readonly alertDefinitionRepository: AlertDefinitionRepository,
  ) {}

  async create(dto: CreateAlertDefinitionDto, projectId: TProjectId): Promise<AlertDefinition> {
    // #TODO: Add validation logic
    return await this.alertDefinitionRepository.create({ data: { ...dto, projectId } as any });
  }

  async updateAlertsDecision(
    alertIds: string[],
    projectId: string,
    decision: AlertState,
  ): Promise<Alert[]> {
    return await this.alertRepository.updateMany(alertIds, projectId, {
      data: {
        state: decision,
        status: this.getStatusFromState(decision),
      },
    });
  }

  async updateAlertsAssignee(
    alertIds: string[],
    projectId: string,
    assigneeId: string | null,
  ): Promise<Alert[]> {
    try {
      return await this.alertRepository.updateMany(alertIds, projectId, {
        data: {
          assigneeId: assigneeId,
        },
      });
    } catch (error) {
      // Should be handled by ProjectAssigneeGuard on controller level
      if (isFkConstraintError(error, 'assigneeId_fkey')) {
        throw new errors.NotFoundException('Assignee not found');
      }

      throw error;
    }
  }

  async getAlerts(
    findAlertsDto: FindAlertsDto,
    projectIds: TProjectId[],
    args?: Omit<
      Parameters<typeof this.alertRepository.findMany>[0],
      'where' | 'orderBy' | 'take' | 'skip'
    >,
  ) {
    return this.alertRepository.findMany(
      {
        ...args,
        where: {
          state: {
            in: findAlertsDto.filter?.state,
          },
          status: {
            in: findAlertsDto.filter?.status,
          },
          ...(findAlertsDto.filter?.assigneeId && {
            OR: [
              {
                assigneeId: {
                  in: findAlertsDto.filter?.assigneeId?.filter((id): id is string => id !== null),
                },
              },
              {
                assigneeId: findAlertsDto.filter?.assigneeId?.includes(null) ? null : undefined,
              },
            ],
          }),
        },
        orderBy: findAlertsDto.orderBy as any,
        take: findAlertsDto.page.size,
        skip: (findAlertsDto.page.number - 1) * findAlertsDto.page.size,
      },
      projectIds,
    );
  }

  // Function to retrieve all alert definitions
  async getAllAlertDefinitions(): Promise<AlertDefinition[]> {
    return await this.prisma.alertDefinition.findMany({
      where: { enabled: true },
    });
  }

  // Function to perform alert checks for each alert definition
  async checkAllAlerts() {
    const alertDefinitions = await this.getAllAlertDefinitions();

    for (const definition of alertDefinitions) {
      const triggered = await this.checkAlert(definition);

      if (triggered) {
        this.logger.log(`Alert triggered for alert definition ${definition.id}`);
      }
    }
  }

  // Specific alert check logic based on the definition
  private async checkAlert(alertDefinition: AlertDefinition): Promise<boolean> {
    let inlineRule: InlineRule;

    const unknownData: unknown = alertDefinition.inlineRule;

    inlineRule = unknownData as InlineRule;

    const results = await this.dataAnalyticsService.runInlineRule(
      alertDefinition.projectId,
      inlineRule,
    );

    if (!results || (Array.isArray(results) && results.length === 0)) {
      return false;
    }

    // Find the missing keys
    results.forEach((aggreatedRow: any) => {
      const missingKeys = _.difference(inlineRule.groupedBy, Object.keys(aggreatedRow));
      // If there are missing keys, log an error message
      if (missingKeys.length > 0) {
        console.error(
          `Alert aggregated row is missing properties for groupBy: ${missingKeys.join(', ')}`,
          {
            inlineRule,
            aggreatedRow,
          },
        );
      }
    });

    // const releavntAlerts = await this.getDeduplicatedAlerts(
    //   alertDefinition.projectId,
    //   alertDefinition,
    //   results,
    // );

    const alertsSetteledResult = await Promise.allSettled<
      Array<{ alert: Alert; alertDefinition: AlertDefinition }>
    >(
      results.map(async (aggreatedRow: any) => {
        const data = _.pick(aggreatedRow, inlineRule.groupedBy);

        return {
          alertDefinition,
          alert: await this.createAlert(alertDefinition, data),
        };
      }),
    );

    const result = {
      fulfilled: [],
      rejected: [],
    } as any;

    alertsSetteledResult.forEach(resultItem => {
      if (resultItem.status === 'fulfilled') {
        result.fulfilled.push(resultItem.value);
      } else if (resultItem.status === 'rejected') {
        result.rejected.push(resultItem.reason);
      }
    });

    return result;
  }

  private createAlert(
    alertDef: AlertDefinition,
    data: Pick<Prisma.AlertUncheckedCreateInput, 'businessId' | 'endUserId' | 'counterpartyId'>,
  ): Promise<Alert> {
    return this.alertRepository.create({
      data: {
        alertDefinitionId: alertDef.id,
        projectId: alertDef.projectId,
        severity: alertDef.defaultSeverity,
        dataTimestamp: new Date(),
        state: AlertState.Triggered,
        status: AlertStatus.New,
        executionDetails: {},
        ...data,
      },
    });
  }

  private async getDeduplicatedAlerts(
    projectId: string,
    alertDef: AlertDefinition,
    data: any,
  ): Promise<any> {
    const cooldownTimeframe = (alertDef.dedupeStrategies as any).cooldownTimeframe;

    const potentialDuplicates = await this.alertRepository.findMany(
      {
        where: {
          AND: [
            { projectId: projectId },
            { alertDefinitionId: alertDef.id },
            { dataTimestamp: { gte: new Date(data.dataTimestamp - cooldownTimeframe) } },
            // Adjust the cooldown timeframe as needed
          ],
        },
      },
      [projectId],
    );

    const groupedDuplicates = potentialDuplicates.reduce((acc: any, alert) => {
      const key = `${alert.projectId}_${alert.alertDefinitionId}_${Math.floor(
        alert.dataTimestamp.getTime() / cooldownTimeframe,
      )}`;
      acc[key] = acc[key] || [];
      acc[key].push(alert);
      return acc;
    }, {});

    return Object.values(groupedDuplicates)
      .filter(group => (group as Alert[]).length > 1)
      .flat() as Alert[];
  }

  private getStatusFromState(newState: AlertState): ObjectValues<typeof AlertStatus> {
    const alertStateToStatusMap = {
      [AlertState.Triggered]: AlertStatus.New,
      [AlertState.UnderReview]: AlertStatus.Pending,
      [AlertState.Escalated]: AlertStatus.Pending,
      [AlertState.Dismissed]: AlertStatus.Completed,
      [AlertState.Rejected]: AlertStatus.Completed,
      [AlertState.Cleared]: AlertStatus.Completed,
    } as const;
    const status = alertStateToStatusMap[newState];

    if (!status) {
      throw new Error(`Invalid alert state: "${newState}"`);
    }

    return status;
  }
}
