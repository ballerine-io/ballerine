import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { TIME_UNITS } from '@/data-analytics/consts';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { InlineRule } from '@/data-analytics/types';
import * as errors from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { isFkConstraintError } from '@/prisma/prisma.util';
import { InputJsonValue, ObjectValues, TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import {
  Alert,
  AlertDefinition,
  AlertSeverity,
  AlertState,
  AlertStatus,
  MonitoringType,
} from '@prisma/client';
import _ from 'lodash';
import { AlertExecutionStatus } from './consts';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { DedupeWindow, TDedupeStrategy, TExecutionDetails } from './types';
import { computeHash } from '@ballerine/common';
import { convertTimeUnitToMilliseconds } from '@/data-analytics/utils';
import { DataInvestigationService } from '@/data-analytics/data-investigation.service';

const DEFAULT_DEDUPE_STRATEGIES = {
  cooldownTimeframeInMinutes: 60 * 24,
  dedupeWindow: {
    timeAmount: 7,
    timeUnit: TIME_UNITS.days,
  },
};

@Injectable()
export class AlertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly dataAnalyticsService: DataAnalyticsService,
    private readonly dataInvestigationService: DataInvestigationService,
    private readonly alertRepository: AlertRepository,
    private readonly alertDefinitionRepository: AlertDefinitionRepository,
  ) {}

  async create(
    dto: Omit<AlertDefinition, 'projectId' | 'createdAt' | 'updatedAt' | 'id'>,
    projectId: TProjectId,
  ) {
    // #TODO: Add validation logic
    return await this.alertDefinitionRepository.create({
      data: {
        ...dto,
        project: {
          connect: {
            id: projectId,
          },
        },
      } as any,
    });
  }
  async getAlertWithDefinition(
    alertId: string,
    projectId: string,
    monitoringType: MonitoringType,
  ): Promise<(Alert & { alertDefinition: AlertDefinition }) | null> {
    const alert = await this.alertRepository.findFirst(
      {
        where: {
          id: alertId,
          alertDefinition: {
            monitoringType: {
              equals: monitoringType,
            },
          },
        },
        include: {
          alertDefinition: true,
        },
      },
      [projectId],
    );

    return alert as Alert & { alertDefinition: AlertDefinition };
  }

  async updateAlertsDecision(
    alertIds: string[],
    projectId: string,
    decision: AlertState,
  ): Promise<Alert[]> {
    return await this.alertRepository.updateMany(alertIds, projectId, {
      data: {
        state: decision,
        decisionAt: new Date(),
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
          assignedAt: new Date(),
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
    monitoringType: MonitoringType,
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
          alertDefinition: {
            monitoringType: {
              equals: monitoringType,
            },
            correlationId: {
              in: findAlertsDto.filter?.correlationIds,
            },
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
  async getAlertDefinitions(options: { type: MonitoringType }): Promise<AlertDefinition[]> {
    return await this.prisma.alertDefinition.findMany({
      where: { enabled: true, monitoringType: options.type },
    });
  }

  // Function to perform alert checks for each alert definition
  async checkAllAlerts() {
    const alertDefinitions = await this.getAlertDefinitions({
      type: MonitoringType.transaction_monitoring,
    });

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

  async checkOngoingMonitoringAlert({
    businessId,
    projectId,
    businessCompanyName,
  }: {
    businessId: string;
    projectId: string;
    businessCompanyName: string;
  }) {
    // const alertDefinitions = await this.alertDefinitionRepository.findMany(
    //   {
    //     where: {
    //       enabled: true,
    //       monitoringType: MonitoringType.ongoing_merchant_monitoring,
    //     },
    //   },
    //   [projectId],
    // );
    //
    // const alertDefinitionsCheck = alertDefinitions.map(async alertDefinition => {
    //   const alertResultData = await this.dataAnalyticsService.checkMerchantOngoingAlert(
    //     {
    //       // @TODO: Fill in the correct values
    //     },
    //     (alertDefinition.inlineRule as InlineRule).options as CheckRiskScoreOptions,
    //     alertDefinition.defaultSeverity,
    //   );
    //
    //   if (alertResultData) {
    //     const subjects = { businessId, projectId };
    //
    //     const subjectArray = Object.entries(subjects).map(([key, value]) => ({
    //       [key]: value,
    //     }));
    //
    //     const createAlertReference = this.createAlert;
    //
    //     return [
    //       alertDefinition,
    //       subjectArray,
    //       { subjectArray },
    //       {
    //         ...alertResultData,
    //         businessCompanyName,
    //       },
    //     ] satisfies Parameters<typeof createAlertReference>;
    //   }
    // });
    //
    // const evaluatedRulesResults = (await Promise.all(alertDefinitionsCheck)).filter(Boolean);
    //
    // const alertArgs = evaluatedRulesResults[0];
    //
    // if (alertArgs) {
    //   return await this.createAlert(...alertArgs);
    // }
  }

  private async checkAlert(alertDefinition: AlertDefinition, ...args: any[]) {
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
          const isAnySubjectUndefinedOrNull = _.some(inlineRule.subjects, field => {
            const val = executionRow[field];

            return _.isNull(val) || _.isUndefined(val);
          });

          if (isAnySubjectUndefinedOrNull) {
            this.logger.error(`Alert aggregated row is missing properties `, {
              inlineRule,
              aggregatedRow: executionRow,
            });

            return alertResponse.rejected.push({
              status: AlertExecutionStatus.FAILED,
              alertDefinition,
              executionRow,
              error: new Error('Aggregated row is missing properties '),
            });
          }

          const subjectResult = _.map(_.pick(executionRow, inlineRule.subjects), (value, key) => ({
            [key]: value,
          }));

          if (await this.isDuplicateAlert(alertDefinition, subjectResult, executionRow)) {
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
              alert: await this.createAlert(alertDefinition, subjectResult, executionRow),
            });
          }
        } catch (error) {
          this.logger.error('Failed to check alert', { error });

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

    return !!alertResponse.fulfilled.length;
  }

  createAlert(
    alertDef: Partial<AlertDefinition> & Required<{ projectId: AlertDefinition['projectId'] }>,
    subject: Array<{ [key: string]: unknown }>,
    executionRow: Record<string, unknown>,
    additionalInfo?: Record<string, unknown>,
  ) {
    const mergedSubject = Object.assign({}, ...(subject || []));

    const projectId = alertDef.projectId;
    const now = new Date();

    const alertData = {
      data: {
        projectId,
        alertDefinitionId: alertDef.id,
        severity: alertDef.defaultSeverity,
        state: AlertState.triggered,
        status: AlertStatus.new,
        additionalInfo: additionalInfo,
        executionDetails: {
          checkpoint: {
            hash: computeHash(executionRow),
          },
          subject: mergedSubject,
          executionRow,
          filters: this.dataInvestigationService.getInvestigationFilter(
            projectId,
            alertDef.inlineRule as InlineRule,
            mergedSubject,
          ),
        } satisfies TExecutionDetails as InputJsonValue,
        ...Object.assign({}, ...(subject || [])),
        updatedAt: now,
        createdAt: now,
        dataTimestamp: now,
      },
    };

    return this.alertRepository.create(alertData);
  }

  private async isDuplicateAlert(
    alertDefinition: AlertDefinition,
    subjectPayload: Array<Record<string, unknown>>,
    executionRow: Record<string, unknown>,
  ): Promise<boolean> {
    if (!alertDefinition.dedupeStrategy) {
      return false;
    }

    const dedupeStrategy = alertDefinition.dedupeStrategy as TDedupeStrategy;

    if (dedupeStrategy.mute) {
      return true;
    }

    const { cooldownTimeframeInMinutes, dedupeWindow } =
      dedupeStrategy || DEFAULT_DEDUPE_STRATEGIES;

    const existingAlert = await this.alertRepository.findFirst(
      {
        where: {
          AND: [{ alertDefinitionId: alertDefinition.id }, ...subjectPayload],
        },
        orderBy: {
          createdAt: 'desc', // Ensure we're getting the most recent alert
        },
      },
      [alertDefinition.projectId],
    );

    if (!existingAlert) {
      return false;
    }

    if (this._isTriggeredSinceLastDedupe(existingAlert, dedupeWindow)) {
      return false;
    }

    const cooldownDurationInMs = cooldownTimeframeInMinutes * 60 * 1000;

    // Calculate the timestamp after which alerts will be considered outside the cooldown period
    if (existingAlert.status !== AlertStatus.completed) {
      await this.alertRepository.updateById(existingAlert.id, {
        data: {
          dedupedAt: new Date(),
        },
      });

      return true;
    }

    if (Date.now() < existingAlert.createdAt.getTime() + cooldownDurationInMs) {
      return true;
    }

    return false;
  }

  private _isTriggeredSinceLastDedupe(existingAlert: Alert, dedupeWindow: DedupeWindow): boolean {
    if (!existingAlert.dedupedAt || !dedupeWindow) {
      return false;
    }

    const dedupeWindowDurationInMs = convertTimeUnitToMilliseconds(dedupeWindow);

    const dedupeWindowEndTime = existingAlert.dedupedAt.getTime() + dedupeWindowDurationInMs;

    return Date.now() > dedupeWindowEndTime;
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

  async getAlertCorrelationIds({ projectId }: { projectId: TProjectId }) {
    const alertDefinitions = await this.alertDefinitionRepository.findMany(
      {
        select: {
          correlationId: true,
        },
      },
      [projectId],
      {
        orderBy: {
          defaultSeverity: 'desc',
        },
      },
    );

    return alertDefinitions.map(({ correlationId }) => correlationId);
  }

  async getAlertsByEntityId(entityId: string, projectId: string) {
    return this.alertRepository.findMany(
      {
        where: {
          counterpartyId: entityId,
        },
      },
      [projectId],
    );
  }

  orderedBySeverity(a: AlertSeverity, b: AlertSeverity) {
    const alertSeverityToNumber = (severity: AlertSeverity) => {
      switch (severity) {
        case AlertSeverity.high:
          return 3;
        case AlertSeverity.medium:
          return 2;
        case AlertSeverity.low:
          return 1;
        default:
          return 0;
      }
    };

    if (a === b) {
      return 0;
    }

    return alertSeverityToNumber(a) < alertSeverityToNumber(b) ? 1 : -1;
  }
}
