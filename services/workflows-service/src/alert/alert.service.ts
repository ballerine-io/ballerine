import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import { Alert, AlertDefinition, AlertState, AlertStatus, Prisma } from '@prisma/client';
import { AlertAssigneeUniqueDto, AlertsIdsByProjectDto } from './dtos/assign-alert.dto';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { AlertDecisionDto } from './dtos/decision-alert.dto';
import * as errors from '@/errors';
import { isFkConstraintError } from '@/prisma/prisma.util';

@Injectable()
export class AlertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
    private readonly alertRepository: AlertRepository,
  ) {}

  async create(dto: CreateAlertDefinitionDto, projectId: TProjectId): Promise<AlertDefinition> {
    // #TODO: Add validation logic
    return await this.prisma.alertDefinition.create({ data: dto as any });
  }

  async updateAlertsAssignee(
    alertIds: string[],
    projectId: string,
    assigneeDto: AlertAssigneeUniqueDto,
  ): Promise<Alert[]> {
    try {
      return await this.alertRepository.updateMany(alertIds, projectId, {
        data: {
          assigneeId: assigneeDto.assigneeId,
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

  async getAlerts(findAlertsDto: FindAlertsDto, projectIds: TProjectId[]) {
    return this.alertRepository.findMany(
      {
        where: {
          state: {
            in: findAlertsDto.filter?.state,
          },
          status: {
            in: findAlertsDto.filter?.status,
          },
          assigneeId: {
            in: findAlertsDto.filter?.assigneeId,
          },
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
        // const ids = await this.createAlert({
        //   /* ... */
        // }); // Provide necessary data
      }
    }
  }

  // Specific alert check logic based on the definition
  private async checkAlert(definition: AlertDefinition): Promise<boolean> {
    // ...
    return true;
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
        return AlertStatus.Completed;

      default:
        throw new Error('Invalid state');
    }
  }
}
