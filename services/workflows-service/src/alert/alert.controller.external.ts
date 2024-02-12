import { FindAlertsDto, FindAlertsSchema } from './dtos/get-alerts.dto';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { Alert, AlertDefinition } from '@prisma/client';
import { type TProjectId } from '@/types';
import * as errors from '../errors';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Alerts')
@Controller('external/alerts')
export class AlertControllerExternal {
  constructor(
    protected readonly service: AlertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}
  @Post()
  @swagger.ApiCreatedResponse({
    type: 'string',
  })
  @UseCustomerAuthGuard()
  @swagger.ApiForbiddenResponse()
  async create(
    @Body() createAlertDto: CreateAlertDefinitionDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<AlertDefinition> {
    // Assuming create method in AlertService accepts CreateAlertDto and returns AlertDefinition
    return await this.service.create(createAlertDto, currentProjectId);
  }

  @Get('/')
  @swagger.ApiOkResponse({ type: Array<Object> }) // TODO: Set type
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UsePipes(new ZodValidationPipe(FindAlertsSchema, 'query'))
  async getAll(@Query() findAlertsDto: FindAlertsDto, @ProjectIds() projectIds: TProjectId[]) {
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
}
