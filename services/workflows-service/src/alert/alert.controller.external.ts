import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import * as types from '@/types';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import type { Response } from 'express';
import { AlertCreateDto } from './dtos/alert-check.dto';

@swagger.ApiTags('external/alerts')
@common.Controller('external/alerts')
export class AlertControllerExternal {
  constructor(
    protected readonly service: AlertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({
    description: 'Alert checks initiated',
    type: [AlertCreateDto],
  })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  async checkAlerts(
    @common.Body() body: AlertCreateDto[],
    @common.Res() response: Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ): Promise<Response> {
    try {
      // Log the request
      this.logger.log(`Checking alerts for project: ${currentProjectId}`, {
        component: 'AlertControllerExternal',
      });

      // Call the service to check the alerts
      await this.service.checkAllAlerts(); // Modify this as needed to handle `body` or `currentProjectId`

      // Respond with success message
      return response
        .status(common.HttpStatus.CREATED)
        .json({ message: 'Alert checks initiated successfully' });
    } catch (error) {
      this.logger.error(`Error checking alerts: ${error instanceof Error ? error.message : ''}`, {
        error,
      });
      return response
        .status(common.HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error checking alerts' });
    }
  }
}
