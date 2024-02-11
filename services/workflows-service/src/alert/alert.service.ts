import { AlertRepository } from '@/alert/alert.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import { Alert, AlertDefinition, Prisma } from '@prisma/client';
import { AlertAssigneeUniqueDto, AlertsIdsByProjectDto } from './dtos/assign-alert.dto';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { FindAlertsDto } from './dtos/get-alerts.dto';
import { NotFoundException } from '@/errors';
import { AlertDecisionDto } from './dtos/decision-alert.dto';

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
    } catch (error: unknown) {
      // Should be handled by ProjectAssigneeGuard on controller level
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2003' &&
          (error.meta as { field_name: string }).field_name.includes('assigneeId_fkey')
        ) {
          throw new NotFoundException('Assignee not found');
        }
      }

      throw error;
    }
  }

  async updateAlertsDecision(
    alertIds: string[],
    projectId: string,
    decisionDto: AlertDecisionDto,
  ): Promise<Alert[]> {
    return await this.alertRepository.updateMany(alertIds, projectId, {
      data: {
        state: decisionDto.decision,
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
}
