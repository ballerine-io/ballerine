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
import { AlertExecutionStatus } from './consts';

// TODO: move to utils

const findValNoCase = (obj: { [key: string]: unknown }, prop: string) => {
  prop = (prop + '').toLowerCase();
  for (let p in obj) {
    if (p in obj && prop === `${p}`.toLowerCase()) {
      return obj[p];
    }
  }
};

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
      try {
        const triggered = await this.checkAlert(definition);

        if (triggered) {
          this.logger.log(`Alert triggered for alert definition '${definition.id}'`);
        }
      } catch (error) {
        this.logger.error('Error while checking alert', {
          error,
          definitionId: definition.id,
        });
      }
    }
  }

  // Specific alert check logic based on the definition
  private async checkAlert(alertDefinition: AlertDefinition): Promise<boolean> {
    const unknownData: unknown = alertDefinition.inlineRule;

    const inlineRule: InlineRule = unknownData as InlineRule;

    const ruleExecutionResults = await this.dataAnalyticsService.runInlineRule(
      alertDefinition.projectId,
      inlineRule,
    );

    if (
      !ruleExecutionResults ||
      (Array.isArray(ruleExecutionResults) && ruleExecutionResults.length === 0)
    ) {
      return false;
    }

    const alertResponse = {
      fulfilled: [],
      rejected: [],
      skipped: [],
    } as any;

    const alertsPromises = ruleExecutionResults.map(
      async (executionRow: Record<string, unknown>) => {
        try {
          if (
            _.some(inlineRule.subjects, field => {
              const val = findValNoCase(executionRow, field);
              _.isNull(val) || _.isUndefined(val);
            })
          ) {
            this.logger.error(`Alert aggregated row is missing properties `, {
              inlineRule,
              aggregatedRow: executionRow,
            });

            return alertResponse.rejected.push({
              status: AlertExecutionStatus.FAILED,
              alertDefinition,
              executionRow,
              error: new Error('Aggregated row is missing properties'),
            });
          }
          const subjectResult = _.map(_.pick(executionRow, inlineRule.subjects), (value, key) => {
            key = key.toLowerCase() === 'counterpartyid' ? 'counterpartyId' : key;
            return { [key]: value };
          });

          if (await this.isDuplicateAlert(alertDefinition, subjectResult)) {
            return alertResponse.skipped.push({
              status: AlertExecutionStatus.SKIPPED,
              alertDefinition,
              executionRow,
            });
          } else {
            return alertResponse.fulfilled.push({
              status: AlertExecutionStatus.SUCCEEDED,
              alertDefinition,
              executionRow,
              alert: await this.createAlert(alertDefinition, subjectResult),
            });
          }
        } catch (error) {
          console.error(error);

          return alertResponse.rejected.push({
            status: AlertExecutionStatus.FAILED,
            error,
            alertDefinition,
            executionRow,
          });
        }
      },
    );

    await Promise.all(alertsPromises);

    this.logger.debug('Finished to run check alerts', alertResponse);

    return alertResponse;
  }

  private createAlert(
    alertDef: AlertDefinition,
    data: { [key: string]: unknown }[],
  ): Promise<Alert> {
    return this.alertRepository.create({
      data: {
        alertDefinitionId: alertDef.id,
        projectId: alertDef.projectId,
        severity: alertDef.defaultSeverity,
        dataTimestamp: new Date(),
        state: AlertState.triggered,
        status: AlertStatus.new,
        executionDetails: {},
        ...Object.assign({}, ...(data || [])),
      },
    });
  }

  private async isDuplicateAlert(
    alertDef: AlertDefinition,
    data: { [key: string]: unknown }[],
  ): Promise<boolean> {
    return await this.alertRepository.exists(
      {
        where: {
          AND: [{ alertDefinitionId: alertDef.id }, ...data],
        },
      },
      [alertDef.projectId],
    );
  }

  private getStatusFromState(newState: AlertState): ObjectValues<typeof AlertStatus> {
    const alertStateToStatusMap = {
      [AlertState.triggered]: AlertStatus.new,
      [AlertState.under_review]: AlertStatus.pending,
      [AlertState.escalated]: AlertStatus.pending,
      [AlertState.dismissed]: AlertStatus.completed,
      [AlertState.rejected]: AlertStatus.completed,
      [AlertState.cleared]: AlertStatus.completed,
    } as const;
    const status = alertStateToStatusMap[newState];

    if (!status) {
      throw new Error(`Invalid alert state: "${newState}"`);
    }

    return status;
  }
}
