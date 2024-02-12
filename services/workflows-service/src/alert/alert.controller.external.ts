import { FindAlertsDto, FindAlertsSchema } from './dtos/get-alerts.dto';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { AlertDefinition, Alert, Prisma } from '@prisma/client';
import type { TProjectId, TProjectIds } from '@/types';
import * as errors from '../errors';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import * as common from '@nestjs/common';
import {
  AlertAssigneeUniqueDto,
  AlertsIdsByProjectDto,
  BulkAlertsResponse,
} from './dtos/assign-alert.dto';
import { BulkStatus, TBulkAssignAlertsResponse } from './types';
import { ProjectAssigneeGuard } from '@/alert/guards/project-assignee.guard';
import { AlertDecisionDto } from './dtos/decision-alert.dto';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Alerts')
@common.Controller('external/alerts')
export class AlertControllerExternal {
  constructor(
    protected readonly service: AlertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
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
    return await this.service.create(createAlertDto, currentProjectId);
  }

  @common.Get('/')
  @swagger.ApiOkResponse({ type: Array<Object> }) // TODO: Set type
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(FindAlertsSchema, 'query'))
  async list(
    @common.Query() findAlertsDto: FindAlertsDto,
    @ProjectIds() projectIds: TProjectId[],
  ): Promise<Alert[]> {
    return await this.service.getAlerts(findAlertsDto, projectIds);
  }

  @common.Patch('assign/:assigneeId')
  @common.UseGuards(ProjectAssigneeGuard)
  @swagger.ApiParam({
    name: 'assigneeId',
    type: 'string',
    description: 'Assignee Id',
    required: true,
  })
  @swagger.ApiOkResponse({ type: BulkAlertsResponse })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async assignBulkAlerts(
    @common.Param() params: AlertAssigneeUniqueDto,
    @common.Body() { alertIds }: AlertsIdsByProjectDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<TBulkAssignAlertsResponse> {
    const updatedAlerts = await this.service.updateAlertsAssignee(
      alertIds,
      currentProjectId,
      params,
    );

    const response: TBulkAssignAlertsResponse = this.createBulkResponse(alertIds, updatedAlerts);

    return response;
  }

  @common.Patch('decision')
  @swagger.ApiOkResponse({ type: BulkAlertsResponse })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async decision(
    @common.Body() { alertIds, decision }: AlertDecisionDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<TBulkAssignAlertsResponse> {
    const updatedAlerts = await this.service.updateAlertsDecision(
      alertIds,
      currentProjectId,
      decision,
    );

    const response: TBulkAssignAlertsResponse = this.createBulkResponse(alertIds, updatedAlerts);

    return response;
  }

  private createBulkResponse(
    alertIds: string[],
    updatedAlerts: Alert[],
  ): TBulkAssignAlertsResponse {
    const updatedAlertsIds = new Set(updatedAlerts.map(alert => alert.id));

    return {
      overallStatus:
        alertIds.length === updatedAlertsIds.size
          ? BulkStatus.SUCCESS
          : updatedAlertsIds.size === 0
          ? BulkStatus.FAILED
          : BulkStatus.PARTIAL,

      response: alertIds.map(alertId => {
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
      }),
    };
  }
}
