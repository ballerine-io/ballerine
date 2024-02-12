import { FindAlertsDto, FindAlertsSchema } from './dtos/get-alerts.dto';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { Alert, AlertDefinition, Prisma } from '@prisma/client';
import type { TProjectId, TProjectIds } from '@/types';
import * as errors from '../errors';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import * as common from '@nestjs/common';
import {
  AlertAssigneeUniqueDto,
  AlertsIdsByProjectDto,
  BulkAssignAlertsResponse,
} from './dtos/assign-alert.dto';
import { BulkStatus, TBulkAssignAlertsResponse } from './types';
import { ProjectAssigneeGuard } from '@/alert/guards/project-assignee.guard';

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
  @common.UsePipes(new ZodValidationPipe(FindAlertsSchema, 'query'))
  async getAll(
    @common.Query() findAlertsDto: FindAlertsDto,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    const alerts = await this.service.getAlerts(findAlertsDto, projectIds, {
      include: {
        alertDefinition: {
          select: {
            description: true,
          },
        },
      },
    });
    const alertsWithDescription = alerts.map(alert => {
      const { alertDefinition, ...alertWithoutDefinition } = alert as Alert & {
        alertDefinition: AlertDefinition;
      };

      return {
        ...alertWithoutDefinition,
        alertDetails: alertDefinition?.description,
      };
    });

    return alertsWithDescription;
  }

  @common.Patch('assign')
  @common.UseGuards(ProjectAssigneeGuard)
  @swagger.ApiOkResponse({ type: BulkAssignAlertsResponse })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async assignWorkflowById(
    @common.Body() { alertIds, assigneeId }: AlertAssigneeUniqueDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<TBulkAssignAlertsResponse> {
    let updatedAlerts = [];

    updatedAlerts = await this.service.updateAlertsAssignee(alertIds, currentProjectId, assigneeId);

    const updatedAlertsIds = new Set(updatedAlerts.map(alert => alert.id));

    const response: TBulkAssignAlertsResponse = {
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

    return response;
  }
}
