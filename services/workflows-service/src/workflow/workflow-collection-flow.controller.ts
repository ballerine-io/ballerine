import { CollectionFlowStateService } from '@/collection-flow/services/collection-flow-state.service';
import { CollectionFlowMissingException } from '@/collection-flow/exceptions/collection-flow-missing.exception';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UpdateCollectionFlowStateDto } from './dtos/update-collection-flow-state.dto';
import { CollectionFlowStateSchema } from '@ballerine/common';
import { Type } from '@sinclair/typebox';

export const WORKFLOW_TAG = 'WorkflowsCollectionFlow';
@swagger.ApiBearerAuth()
@swagger.ApiTags(WORKFLOW_TAG)
@common.Controller('external/workflows/collection-flow')
export class WorkflowCollectionFlowController {
  constructor(
    protected readonly collectionFlowStateService: CollectionFlowStateService,
    protected readonly appLogger: AppLoggerService,
  ) {}

  @swagger.ApiOperation({ summary: 'Get collection flow state for a workflow' })
  @swagger.ApiParam({ name: 'workflowId', description: 'ID of the workflow' })
  @swagger.ApiResponse({
    status: 200,
    description: 'Collection flow state retrieved successfully',
    schema: Type.Object({
      state: Type.Union([Type.Null(), CollectionFlowStateSchema]),
    }),
  })
  @common.Get('/:workflowId/state')
  async getCollectionFlowState(
    @common.Param('workflowId') workflowId: string,
    @CurrentProject() projectId: TProjectId,
  ) {
    try {
      const collectionFlowState = await this.collectionFlowStateService.getCollectionFlowState(
        workflowId,
        [projectId],
      );

      return {
        state: collectionFlowState,
      };
    } catch (error) {
      if (error instanceof CollectionFlowMissingException) {
        this.appLogger.error(`Collection flow state not found for workflow ${workflowId}`, {
          workflowId,
          projectId,
        });

        return {
          state: null,
        };
      }

      throw error;
    }
  }

  @swagger.ApiOperation({ summary: 'Update collection flow state for a workflow' })
  @swagger.ApiParam({ name: 'workflowId', description: 'ID of the workflow' })
  @swagger.ApiBody({ type: UpdateCollectionFlowStateDto })
  @swagger.ApiResponse({
    status: 200,
    description: 'Collection flow state updated successfully',
    schema: CollectionFlowStateSchema,
  })
  @common.Put('/:workflowId/state')
  async updateCollectionFlowState(
    @CurrentProject() projectId: TProjectId,
    @common.Param('workflowId') workflowId: string,
    @common.Body() body: UpdateCollectionFlowStateDto,
  ) {
    return this.collectionFlowStateService.updateCollectionFlowState(workflowId, body, [projectId]);
  }
}
