import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds, TProjectId } from '@/types';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '@/errors';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { isObject } from '@ballerine/common';
import { Validate } from 'ballerine-nestjs-typebox';
import { Type } from '@sinclair/typebox';

@Controller('workflow-definition')
export class WorkflowDefinitionController {
  constructor(protected readonly workflowDefinitionService: WorkflowDefinitionService) {}

  @common.Get()
  async getWorkflowDefinitions(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query() dto: GetWorkflowDefinitionListDto,
  ) {
    return this.workflowDefinitionService.getList(dto, projectIds);
  }

  @common.Get('/:id/input-context-schema')
  @UseCustomerAuthGuard()
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getInputContextSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    return await this.workflowDefinitionService.getInputContextSchema(id, projectIds);
  }

  @common.Get('/:id/input-context-schema/custom-data-schema')
  @UseCustomerAuthGuard()
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    const inputContextSchema = await this.workflowDefinitionService.getInputContextSchema(
      id,
      projectIds,
    );

    return isObject(inputContextSchema) && 'customData' in inputContextSchema
      ? inputContextSchema?.customData
      : {};
  }

  @common.Put('/:id/input-context-schema/custom-data-schema')
  @UseCustomerAuthGuard()
  async updateInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
    @common.Body() customDataSchema: Record<string, unknown>,
  ) {
    return this.workflowDefinitionService.updateInputContextCustomDataSchema(
      id,
      projectIds,
      customDataSchema,
    );
  }
}
