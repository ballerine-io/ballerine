import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { WhereIdInput } from '@/common/where-id-input';
import * as errors from '@/errors';
import type { InputJsonValue, TProjectId, TProjectIds } from '@/types';
import { UiDefinitionByRuntimeIdDto } from '@/ui-definition/dtos/ui-definition-by-runtime-id.dto';
import { UiDefinitionByWorkflowDefinitionIdDto } from '@/ui-definition/dtos/ui-definition-by-workflow-definition-id.dto';
import { UiDefinitionCreateDto } from '@/ui-definition/dtos/ui-definition-create.dto';
import { UiDefinitionModel } from '@/ui-definition/ui-definition.model';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import * as common from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

@swagger.ApiExcludeController()
@common.Controller('internal/ui-definition')
@Injectable()
export class UiDefinitionControllerInternal {
  constructor(protected readonly service: UiDefinitionService) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: UiDefinitionCreateDto })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(
    @common.Body() data: UiDefinitionCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return await this.service.create({
      data: {
        ...data,
        crossEnvKey: data.workflowDefinitionId,
        definition: data.definition as InputJsonValue,
        uiSchema: data.uiSchema as InputJsonValue,
        projectId: currentProjectId,
      },
    });
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async get(
    @common.Param() params: WhereIdInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    return await this.service.getById(params.id, {}, projectIds);
  }

  @common.Get('/workflow-definition/:workflowDefinitionId')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async getByDefinitionId(
    @common.Param() params: UiDefinitionByWorkflowDefinitionIdDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    return await this.service.getByWorkflowDefinitionId(
      params.workflowDefinitionId,
      params.uiContext,
      projectIds,
    );
  }

  @common.Get('/workflow-runtime/:workflowRuntimeId')
  @swagger.ApiOkResponse({ type: [UiDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  async getByRuntimeId(
    @common.Param('workflowRuntimeId') workflowRuntimeId: string,
    @common.Query() query: UiDefinitionByRuntimeIdDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UiDefinitionModel> {
    return await this.service.getByRuntimeId(workflowRuntimeId, query.uiContext, projectIds, {});
  }
}
