import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import * as types from '@/types';
import type { Response } from 'express';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@common.Controller('internal/alerts')
export class AlertControllerInternal {
  constructor(
    protected readonly service: AlertService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Post()
  @common.UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({
    description: 'Alert checks initiated',
    // type: [{}],
  })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  async checkAlerts(
    @common.Body() body: any,
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
