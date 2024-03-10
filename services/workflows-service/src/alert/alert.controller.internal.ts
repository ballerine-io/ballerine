import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import type { Response } from 'express';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@common.Controller('internal/alerts')
@swagger.ApiExcludeController()
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
  async checkAlerts(@common.Res() response: Response): Promise<Response> {
    try {
      // Call the service to check the alerts
      await this.service.checkAllAlerts();

      // Respond with success message
      return response
        .status(common.HttpStatus.CREATED)
        .json({ message: 'Alert checks initiated successfully' });
    } catch (error) {
      this.logger.error(`Error checking alerts: ${error instanceof Error ? error.message : ''}`, {
        error,
      });

      throw new common.InternalServerErrorException();
    }
  }
}
