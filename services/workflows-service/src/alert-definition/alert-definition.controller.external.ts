import { AlertDefinitionService } from '@/alert-definition/alert-definition.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertDefinition } from '@prisma/client';

@common.Controller('/external/alert-definition')
export class AlertDefinitionsController {
  constructor(private readonly alertDefinitionService: AlertDefinitionService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: Array<AlertDefinition[]> })
  async getAlertDefinitions(@ProjectIds() projectIds: TProjectIds): Promise<AlertDefinition[]> {
    return this.alertDefinitionService.list(projectIds);
  }
}
