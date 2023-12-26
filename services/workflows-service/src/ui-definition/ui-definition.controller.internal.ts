import { ProjectScopeService } from '@/project/project-scope.service';
import * as common from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import * as swagger from '@nestjs/swagger';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';
import { UiDefinitionModel } from '@/ui-definition/ui-definition.model';
import { WhereIdInput } from '@/common/where-id-input';
import { UiDefinitionByRuntimeIdDto } from '@/ui-definition/dtos/ui-definition-by-runtime-id.dto';
import { UiDefinitionByWorkflowDefinitionIdDto } from '@/ui-definition/dtos/ui-definition-by-workflow-definition-id.dto';

@swagger.ApiTags('internal/ui-definition')
@common.Controller('internal/ui-definition')
@Injectable()
export class UiDefinitionController {
  constructor(
    protected readonly service: UiDefinitionService,
    protected readonly projectScopeService: ProjectScopeService,
  ) {}

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async get(
    @common.Param() params: WhereIdInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    const uiDefinition = await this.service.getById(params.id, {}, projectIds);

    return uiDefinition;
  }

  @common.Get('/workflow-definition/:workflowDefinitionId')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async getByDefinitionId(
    @common.Param() params: UiDefinitionByWorkflowDefinitionIdDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    const uiDefinition = await this.service.getByWorkflowDefinitionId(
      params.workflowDefinitionId,
      params.uiContext,
      projectIds,
      {},
    );

    return uiDefinition;
  }

  @common.Get('/workflow-runtime/:workflowRuntimeId')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async getByRuntimeId(
    @common.Param('workflowRuntimeId') workflowRuntimeId: string,
    @common.Query() query: UiDefinitionByRuntimeIdDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    const uiDefinition = await this.service.getByRuntimeId(
      workflowRuntimeId,
      query.uiContext,
      projectIds,
      {},
    );

    return uiDefinition;
  }
}
