import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { alertService } from '@/alert/alert.service';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import * as types from '@/types';

@swagger.ApiTags('internal/alerts')
@common.Controller('internal/alerts')
export class alertControllerInternal {
  constructor(protected readonly service: alertService) {}

  // STUB
  @common.Post()
  @common.UseGuards(AdminAuthGuard)
  // @swagger.ApiCreatedResponse({ type: [alertCreateDto] })
  @swagger.ApiForbiddenResponse()
  async check(@common.Body() body: any, @CurrentProject() currentProjectId: types.TProjectId) {
    console.log('check alert', currentProjectId);
    return 'OK';
  }
}
