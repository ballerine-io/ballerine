import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import type { InputJsonValue, TProjectId, TProjectIds } from '@/types';
import {
  CustomDataSchemaUpdateDto,
  RootLevelContextSchemaDto,
  type TCustomDataSchemaUpdateDto,
} from '@/workflow-defintion/dtos/custom-data-schema-update-dto';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowDefinitionWhereUniqueInputSchema } from '@/workflow/dtos/workflow-where-unique-input';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { ApiValidationErrorResponse } from '@/common/decorators/http/errors.decorator';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { UpdateWorkflowDefinitionDto } from '@/workflow-defintion/dtos/update-workflow-definition-dto';
import { UpdateWorkflowDefinitionExtensionsDto } from '@/workflow-defintion/dtos/update-workflow-definition-extensions-dto';
import { DocumentInsertSchema } from '@ballerine/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as typebox from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import * as errors from '../errors';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

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

  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow Definition - Input Context Schema',
    schema: RootLevelContextSchemaDto,
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: WorkflowDefinitionWhereUniqueInputSchema,
      },
    ],
    response: Type.Any(),
  })
  @common.Get('/:id/input-context-schema')
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

  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 200,
    description: 'Workflow Definition upgraded successfully',
    schema: Type.Object({}),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: WorkflowDefinitionWhereUniqueInputSchema,
      },
      {
        type: 'body',
        schema: Type.Partial(
          Type.Object({
            name: Type.Optional(Type.String()),
            displayName: Type.Optional(Type.String()),
            definition: Type.Optional(Type.Object({}, { additionalProperties: true })),
            config: Type.Optional(Type.Object({}, { additionalProperties: true })),
            extensions: Type.Optional(Type.Object({}, { additionalProperties: true })),
            submitStates: Type.Optional(Type.Object({}, { additionalProperties: true })),
            contextSchema: Type.Optional(Type.Object({}, { additionalProperties: true })),
          }),
        ),
      },
    ],
    response: Type.Any(),
  })
  @common.Post('/:id/upgrade')
  async upgradeWorkflowDefinition(
    @common.Param('id') id: string,
    @common.Body() updateArgs: any,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    try {
      const upgradedDefinition = await this.workflowDefinitionService.upgradeDefinitionVersion(
        id,
        updateArgs as any,
        currentProjectId,
      );
      return upgradedDefinition;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }
      throw error;
    }
  }

  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 200,
    description: 'Workflow Definition - Input Context Custom Data Schema',
    schema: Type.Object({}),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: WorkflowDefinitionWhereUniqueInputSchema,
      },
    ],
    response: Type.Any(),
  })
  @common.Get('/:id/input-context-schema/custom-data-schema')
  async getInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    try {
      const inputContextSchema = await this.workflowDefinitionService.getInputContextSchema(
        id,
        projectIds,
      );

      return inputContextSchema?.properties.customData ?? {};
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No WorkflowDefinition with ID ${id} was found`, {
          cause: error,
        });
      }

      throw error;
    }
  }

  @UseCustomerAuthGuard()
  @ApiResponse({
    status: 200,
    description: 'Workflow Definition - Input Context Custom Data Schema',
    schema: CustomDataSchemaUpdateDto,
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
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: WorkflowDefinitionWhereUniqueInputSchema,
      },
      {
        type: 'body',
        schema: CustomDataSchemaUpdateDto,
      },
    ],
    response: Type.Any(),
  })
  @common.Put('/:id/input-context-schema/custom-data-schema')
  async updateInputContextCustomDataSchema(
    @common.Param('id') id: string,
    @common.Body() body: TCustomDataSchemaUpdateDto,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    try {
      return this.workflowDefinitionService.updateInputContextCustomDataSchema(
        id,
        projectIds,
        body,
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
      newDocumentsSchemas as Array<typeof DocumentInsertSchema>,
    );
  }

  @common.Put('/:id/definition')
  @common.HttpCode(200)
  async updateWorkflowDefinition(
    @common.Param('id') workflowDefinitionId: string,
    @common.Body() body: UpdateWorkflowDefinitionDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return this.workflowDefinitionService.updateById(
      workflowDefinitionId,
      {
        data: {
          definition: body.definition as InputJsonValue,
        },
      },
      projectIds,
    );
  }

  @common.Put('/:id/extensions')
  @common.HttpCode(200)
  async updateWorkflowDefinitionExtensions(
    @common.Param('id') workflowDefinitionId: string,
    @common.Body() body: UpdateWorkflowDefinitionExtensionsDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return this.workflowDefinitionService.updateById(
      workflowDefinitionId,
      {
        data: {
          extensions: body.extensions as InputJsonValue,
        },
      },
      projectIds,
    );
  }
}
