import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import * as types from '@/types';
import { AlertCreateDto } from './dtos/alert-check.dto';

// Path to your DTO

@common.Controller('internal/alerts')
export class AlertControllerInternal {
  constructor(protected readonly service: AlertService) {}

  @common.Post()
  @common.UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({
    description: 'Alert check executed',
    type: String,
  })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  async check(
    @common.Body() body: AlertCreateDto,
    @CurrentProject() currentProjectId: types.TProjectId,
  ): Promise<string> {
    throw new common.NotImplementedException();

    return '200';
    // console.log('check alert', body.alertType, 'for project', currentProjectId);

    // try {
    //   const result = await this.service.checkAllAlerts(body.alertType, currentProjectId);
    //   return result ? 'Alert triggered' : 'No alert triggered';
    // } catch (error) {
    //   throw new common.HttpException(
    //     'Error checking alert',
    //     common.HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
