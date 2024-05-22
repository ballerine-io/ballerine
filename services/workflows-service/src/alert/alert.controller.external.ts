import { AlertDefinitionService } from '@/alert-definition/alert-definition.service';
import { ProjectAssigneeGuard } from '@/alert/guards/project-assignee.guard';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import type { AuthenticatedEntity, TProjectId } from '@/types';
import { UserData } from '@/user/user-data.decorator';
import * as common from '@nestjs/common';
import { Res } from '@nestjs/common';
import { AlertService } from '@/alert/alert.service';

import * as swagger from '@nestjs/swagger';
import { Alert, AlertDefinition, MonitoringType } from '@prisma/client';
import * as errors from '../errors';
import { AlertAssigneeUniqueDto, AlertUpdateResponse } from './dtos/assign-alert.dto';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { AlertDecisionDto } from './dtos/decision-alert.dto';
import { FindAlertsDto, FindAlertsSchema } from './dtos/get-alerts.dto';
import {
  BulkStatus,
  TAlertMerchantResponse,
  TAlertTransactionResponse,
  TBulkAssignAlertsResponse,
} from './types';
import express from 'express';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Alerts')
@common.Controller('external/alerts')
export class AlertControllerExternal {
  constructor(
    protected readonly alertService: AlertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly alertDefinitionService: AlertDefinitionService,
  ) {}
  @common.Post()
  @swagger.ApiCreatedResponse({
    type: 'string',
  })
  @UseCustomerAuthGuard()
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() createAlertDto: CreateAlertDefinitionDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<AlertDefinition> {
    // Assuming create method in AlertService accepts CreateAlertDto and returns AlertDefinition
    return await this.alertService.create(createAlertDto, currentProjectId);
  }

  @common.Get('/')
  @swagger.ApiOkResponse({ type: Array<TAlertTransactionResponse> }) // TODO: Set type
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(FindAlertsSchema, 'query'))
  async list(@common.Query() findAlertsDto: FindAlertsDto, @ProjectIds() projectIds: TProjectId[]) {
    const alerts = await this.alertService.getAlerts(
      findAlertsDto,
      MonitoringType.transaction_monitoring,
      projectIds,
      {
        include: {
          alertDefinition: {
            select: {
              correlationId: true,
              description: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          counterparty: {
            select: {
              id: true,
              business: {
                select: {
                  id: true,
                  correlationId: true,
                  companyName: true,
                },
              },
              endUser: {
                select: {
                  id: true,
                  correlationId: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    );

    return alerts.map(alert => {
      const { alertDefinition, assignee, counterparty, state, ...alertWithoutDefinition } =
        alert as TAlertTransactionResponse;

      return {
        ...alertWithoutDefinition,
        correlationId: alertDefinition.correlationId,
        assignee: assignee
          ? {
              id: assignee?.id,
              fullName: `${assignee?.firstName} ${assignee?.lastName}`,
              avatarUrl: assignee?.avatarUrl,
            }
          : null,
        alertDetails: alertDefinition.description,
        subject: counterparty.business
          ? {
              type: 'business',
              id: counterparty.business.id,
              name: counterparty.business.companyName,
              correlationId: counterparty.business.correlationId,
            }
          : {
              type: 'counterparty',
              id: counterparty.endUser.id,
              correlationId: counterparty.endUser.correlationId,
              name: `${counterparty.endUser.firstName} ${counterparty.endUser.lastName}`,
            },
        decision: state,
      };
    });
  }

  @common.Get('/business-report')
  @swagger.ApiOkResponse({ type: Array<TAlertMerchantResponse> }) // TODO: Set type
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(FindAlertsSchema, 'query'))
  async listBusinessReportAlerts(
    @common.Query() findAlertsDto: FindAlertsDto,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    const alerts = await this.alertService.getAlerts(
      findAlertsDto,
      MonitoringType.ongoing_merchant_monitoring,
      projectIds,
      {
        include: {
          alertDefinition: {
            select: {
              correlationId: true,
              description: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          business: {
            select: {
              id: true,
              companyName: true,
              businessReports: true,
            },
          },
        },
      },
    );

    return alerts.map(alert => {
      const {
        alertDefinition,
        assignee,
        business,
        state,
        executionDetails: _,
        ...alertWithoutDefinition
      } = alert as TAlertMerchantResponse;

      return {
        ...alertWithoutDefinition,
        correlationId: alertDefinition.correlationId,
        assignee: assignee
          ? {
              id: assignee?.id,
              fullName: `${assignee?.firstName} ${assignee?.lastName}`,
              avatarUrl: assignee?.avatarUrl,
            }
          : null,
        alertDetails: alertDefinition.description,
        subject: {
          ...business,
        },
        decision: state,
      };
    });
  }

  @common.Patch('assign')
  @common.UseGuards(ProjectAssigneeGuard)
  @swagger.ApiOkResponse({ type: [AlertUpdateResponse] })
  @swagger.ApiResponse({ type: [AlertUpdateResponse], status: 207 })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async assignAlertById(
    @common.Body() { alertIds, assigneeId }: AlertAssigneeUniqueDto,
    @CurrentProject() currentProjectId: TProjectId,
    @Res() res: express.Response,
  ) {
    let updatedAlerts = [];

    updatedAlerts = await this.alertService.updateAlertsAssignee(
      alertIds,
      currentProjectId,
      assigneeId,
    );

    const { response, status } = this.createBulkResponse(alertIds, updatedAlerts);

    res.status(status).json(response);
  }

  @common.Patch('decision')
  @swagger.ApiOkResponse({ type: [AlertUpdateResponse] })
  @swagger.ApiResponse({ type: [AlertUpdateResponse], status: 207 })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async decision(
    @common.Body() { alertIds, decision }: AlertDecisionDto,
    @CurrentProject() currentProjectId: TProjectId,
    @UserData() authenticatedAssignee: AuthenticatedEntity,
    @Res() res: express.Response,
  ) {
    // Assign alerts to the authenticated assignee
    if (authenticatedAssignee?.user?.id) {
      await this.alertService.updateAlertsAssignee(
        alertIds,
        currentProjectId,
        authenticatedAssignee.user.id,
      );
    }

    const updatedAlerts = await this.alertService.updateAlertsDecision(
      alertIds,
      currentProjectId,
      decision,
    );

    const { response, status } = this.createBulkResponse(alertIds, updatedAlerts);

    res.status(status).json(response);
  }

  private createBulkResponse(
    alertIds: string[],
    updatedAlerts: Alert[],
  ): {
    response: TBulkAssignAlertsResponse;
    status: 200 | 207;
  } {
    const updatedAlertsIds = new Set(updatedAlerts.map(alert => alert.id));

    const response = alertIds.map(alertId => {
      if (updatedAlertsIds.has(alertId)) {
        return {
          alertId,
          status: BulkStatus.SUCCESS,
        };
      }

      return {
        alertId,
        status: BulkStatus.FAILED,
        errors: [
          {
            message: 'Alert not found or not updated.',
          },
        ],
      };
    });

    const status = response.some(alert => alert.status === BulkStatus.FAILED) ? 207 : 200;

    return {
      response,
      status,
    };
  }

  @common.Get('/:id/alert-definition')
  @swagger.ApiOkResponse({ type: Object }) // TODO: Set type
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getAlertDefinitionByAlertId(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    return this.alertDefinitionService.getByAlertId(id, projectIds);
  }
}
