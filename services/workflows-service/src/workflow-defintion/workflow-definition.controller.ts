import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds, TProjectId } from '@/types';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import * as typebox from '@sinclair/typebox';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as errors from '../errors';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentInsertSchema } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { ApiValidationErrorResponse } from '@/common/decorators/http/errors.decorator';

@ApiTags('Workflow Definition')
@ApiBearerAuth()
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
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
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
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
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
    @ProjectIds() projectIds: TProjectId[],
    @common.Body() customDataSchema: Record<string, unknown>,
  ) {
    return this.workflowDefinitionService.updateInputContextCustomDataSchema(
      id,
      projectIds,
      customDataSchema,
    );
  }

  @common.Get('/:id/documents-schema')
  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  async getDocumentsSchema(@common.Param('id') id: string, @ProjectIds() projectIds: TProjectId[]) {
    try {
      const documentsSchema = await this.workflowDefinitionService.getDocumentsSchema(
        id,
        projectIds,
      );

      return documentsSchema ?? {};
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }

      throw error;
    }
  }

  @common.Put('/:id/documents-schema')
  @UseCustomerAuthGuard()
  @Validate({
    request: [
      {
        type: 'body',
        schema: Type.Array(DocumentInsertSchema),
        description: 'Documents Schema Update',
        stripUnknownProps: false,
      },
    ],
    response: Type.Any(),
  })
  @ApiValidationErrorResponse()
  async updateDocumentsSchema(
    @common.Body() newDocumentsSchemas: unknown,
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    return this.workflowDefinitionService.updateDocumentsSchema(
      id,
      projectIds,
      newDocumentsSchemas as (typeof DocumentInsertSchema)[],
    );
  }
}
