import { map } from 'rxjs/operators';
import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { isFkConstraintError } from '@/prisma/prisma.util';
import { TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import { Alert, AlertDefinition, AlertState, AlertStatus } from '@prisma/client';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { InlineRule } from '@/data-analytics/types';

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
    const _data = { ...dto, projectId };
    // #TODO: Add validation logic
    return await this.alertDefinitionRepository.create({ data: _data as any });
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
  async checkAllAlerts(): Promise<void> {
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
    const inlineRule = alertDefinition.inlineRule as InlineRule;

    const results = await this.dataAnalyticsService.runInlineRule(inlineRule);

    if (!results || (Array.isArray(results) && results.length === 0)) {
      return false;
    }

    await Promise.allSettled(
      results.map(async (result: any) => {
        // TODO: dedupe strategy
        const ids = await this.createAlert(alertDefinition, result);
      }),
    );

    return true;
  }

  private createAlert(alertDef: AlertDefinition, data: any): Promise<Alert> {
    return this.alertRepository.create({
      data: {
        alertDefinitioniId: alertDef.id,
        projectId: alertDef.projectId,
        severity: alertDef.defaultSeverity,
        dataTimestamp: new Date(),
        state: AlertState.Triggered,
        status: AlertStatus.New,
        ...data,
        // business?: BusinessCreateNestedOneWithoutAlertInput
        // endUser?: EndUserCreateNestedOneWithoutAlertInput
        // executionDetails: JsonNullValueInput | InputJsonValue
        // assignedAt?: Date | string | null // TODO: manual assignee logic
        // counterparty?: CounterpartyCreateNestedOneWithoutAlertsInput
      },
    });
  }

  private getStatusFromState(newState: AlertState): AlertStatus {
    switch (newState) {
      case AlertState.Triggered:
        return AlertStatus.New;

      case AlertState.UnderReview:
      case AlertState.Escalated:
        return AlertStatus.Pending;

      case AlertState.Resolved:
      case AlertState.Acknowledged:
      case AlertState.Dismissed:
      case AlertState.Rejected:
      case AlertState.NotSuspicious:
        return AlertStatus.Completed;

      default:
        throw new Error('Invalid state');
    }
  }
}
