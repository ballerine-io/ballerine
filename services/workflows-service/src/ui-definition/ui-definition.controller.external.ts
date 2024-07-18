import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { UiDefinitionModel } from '@/ui-definition/ui-definition.model';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

@common.Controller('external/ui-definition')
export class UIDefinitionExternalController {
  constructor(
    protected readonly service: UiDefinitionService,
    protected readonly projectScopeService: ProjectScopeService,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async get(@ProjectIds() projectIds: TProjectIds): Promise<UiDefinitionModel[]> {
    return await this.service.list(projectIds);
  }
}
