import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { UpdateUiDefinitionDto } from '@/ui-definition/dtos/update-ui-definition.dto';
import { UiDefinitionModel } from '@/ui-definition/ui-definition.model';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { replaceNullsWithUndefined } from '@ballerine/common';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

@common.Controller('external/ui-definition')
@swagger.ApiTags('UI Definitions')
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

  @common.Put(':id')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async update(
    @ProjectIds() projectIds: TProjectIds,
    @common.Param('id') id: string,
    @common.Body() payload: UpdateUiDefinitionDto,
  ) {
    //@ts-ignore
    return await this.service.update(
      id,
      { data: replaceNullsWithUndefined(payload.uiDefinition) },
      projectIds,
    );
  }
}
