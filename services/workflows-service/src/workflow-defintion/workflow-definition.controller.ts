import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds, TProjectId } from '@/types';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { Type } from '@sinclair/typebox';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as errors from '../errors';
import { ApiResponse } from '@nestjs/swagger';
import * as swagger from '@nestjs/swagger';
import { CustomDataSchemaUpdateDto } from '@/workflow-defintion/dtos/custom-data-schema-update-dto';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Workflow Definitions')
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
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  async getInputContextSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    try {
      return await this.workflowDefinitionService.getInputContextSchema(id, projectIds);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }

      throw error;
    }
  }

  @common.Get('/:id/input-context-schema/custom-data-schema')
  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  async getInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    try {
      const inputContextSchema = await this.workflowDefinitionService.getInputContextSchema(
        id,
        projectIds,
      );

      return inputContextSchema?.customData ?? {};
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }

      throw error;
    }
  }

  @common.Put('/:id/input-context-schema/custom-data-schema')
  @UseCustomerAuthGuard()
  async updateInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @common.Body() customDataSchema: CustomDataSchemaUpdateDto,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    try {
      return this.workflowDefinitionService.updateInputContextCustomDataSchema(
        id,
        projectIds,
        customDataSchema.schema,
      );
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }

      throw error;
    }
  }
}
