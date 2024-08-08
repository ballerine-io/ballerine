import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { computeHash } from '@/common/utils/sign/sign';
import { TIME_UNITS } from '@/data-analytics/consts';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { CheckRiskScoreOptions, InlineRule } from '@/data-analytics/types';
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
  BusinessReport,
  MonitoringType,
} from '@prisma/client';
import _ from 'lodash';
import { AlertExecutionStatus } from './consts';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { TDedupeStrategy, TExecutionDetails } from './types';

const DEFAULT_DEDUPE_STRATEGIES = {
  cooldownTimeframeInMinutes: 60 * 24,
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
  ): Promise<(Alert & { alertDefinition: AlertDefinition }) | null> {
    const alert = await this.alertRepository.findById(
      alertId,
      {
        where: {
          id: alertId,
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

  async checkOngoingMonitoringAlert(businessReport: BusinessReport, businessCompanyName: string) {
    const alertDefinitions = await this.alertDefinitionRepository.findMany(
      {
        where: {
          enabled: true,
          monitoringType: MonitoringType.ongoing_merchant_monitoring,
        },
      },
      [businessReport.projectId],
    );

    const alertDefinitionsCheck = alertDefinitions.map(async alertDefinition => {
      const alertResultData = await this.dataAnalyticsService.checkMerchantOngoingAlert(
        businessReport,
        (alertDefinition.inlineRule as InlineRule).options as CheckRiskScoreOptions,
        alertDefinition.defaultSeverity,
      );

      if (alertResultData) {
        const { id: businessReportId, businessId, projectId } = businessReport;
        const subjects = { businessId, projectId };

        const subjectArray = Object.entries(subjects).map(([key, value]) => ({
          [key]: value,
        }));

        const createAlertReference = this.createAlert;

        return [
          alertDefinition,
          subjectArray,
          { subjectArray },
          {
            ...alertResultData,
            businessReportId,
            businessCompanyName,
          },
        ] satisfies Parameters<typeof createAlertReference>;
      }
    });

    const evaluatedRulesResults = (await Promise.all(alertDefinitionsCheck)).filter(Boolean);

    const alertArgs = evaluatedRulesResults[0];

    if (alertArgs) {
      return await this.createAlert(...alertArgs);
    }
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
              error: new Error('Aggregated row is missing properties'),
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

    return !!alertResponse.fulfilled.length;
  }

  createAlert(
    alertDef: Partial<AlertDefinition>,
    subject: Array<{ [key: string]: unknown }>,
    executionRow: Record<string, unknown>,
    additionalInfo?: Record<string, unknown>,
  ) {
    return this.alertRepository.create({
      data: {
        alertDefinitionId: alertDef.id,
        projectId: alertDef.projectId,
        severity: alertDef.defaultSeverity,
        dataTimestamp: new Date(),
        state: AlertState.triggered,
        status: AlertStatus.new,
        additionalInfo: additionalInfo,
        executionDetails: {
          checkpoint: {
            hash: computeHash(executionRow),
          },
          subject: Object.assign({}, ...(subject || [])),
          executionRow,
        } satisfies TExecutionDetails as InputJsonValue,
        ...Object.assign({}, ...(subject || [])),
      },
    });
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

    const { cooldownTimeframeInMinutes } = dedupeStrategy || DEFAULT_DEDUPE_STRATEGIES;

    const existingAlert = await this.alertRepository.findFirst(
      {
        where: {
          AND: [{ alertDefinitionId: alertDefinition.id }, ...subjectPayload],
        },
      },
      [alertDefinition.projectId],
    );

    if (!existingAlert) {
      return false;
    }

    const cooldownDurationInMs = cooldownTimeframeInMinutes * 60 * 1000;

    // Calculate the timestamp after which alerts will be considered outside the cooldown period
    if (existingAlert.status !== AlertStatus.completed) {
      await this.alertRepository.updateById(existingAlert.id, {
        data: {
          updatedAt: new Date(),
        },
      });

      return true;
    }

    if (Date.now() < existingAlert.createdAt.getTime() + cooldownDurationInMs) {
      return true;
    }

    return false;
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

  buildTransactionsFiltersByAlert(alert: Alert & { alertDefinition: AlertDefinition }) {
    const filters: {
      endDate: Date;
      startDate: Date | undefined;
    } = {
      endDate: alert.updatedAt || alert.createdAt,
      startDate: undefined,
    };

    const inlineRule = alert?.alertDefinition?.inlineRule as InlineRule;

    // @ts-ignore - TODO: Replace logic with proper implementation for each rule
    // eslint-disable-next-line
    let { timeAmount, timeUnit } = inlineRule.options;

    if (!timeAmount || !timeUnit) {
      if (
        inlineRule.fnName === 'evaluateHighVelocityHistoricAverage' &&
        inlineRule.options.lastDaysPeriod &&
        timeUnit
      ) {
        timeAmount = inlineRule.options.lastDaysPeriod.timeAmount;
      } else {
        return filters;
      }
    }

    const startDate = new Date(filters.endDate);

    let subtractValue = 0;

    const baseSubstractByMin = timeAmount * 60 * 1000;

    switch (timeUnit) {
      case TIME_UNITS.minutes:
        subtractValue = baseSubstractByMin;
        break;
      case TIME_UNITS.hours:
        subtractValue = 60 * baseSubstractByMin;
        break;
      case TIME_UNITS.days:
        subtractValue = 24 * 60 * baseSubstractByMin;
        break;
      case TIME_UNITS.months:
        startDate.setMonth(startDate.getMonth() - timeAmount);
        break;
      case TIME_UNITS.years:
        startDate.setFullYear(startDate.getFullYear() - timeAmount);
        break;
    }

    startDate.setHours(0, 0, 0, 0);

    filters.startDate = new Date(startDate.getTime() - subtractValue);

    return filters;
  }
}
