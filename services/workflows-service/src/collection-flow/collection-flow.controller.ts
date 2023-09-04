import * as common from '@nestjs/common';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AuthorizeDto } from '@/collection-flow/dto/authorize-input.dto';
import { Customer, EndUser } from '@prisma/client';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-workflow-input.dto';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { UpdateFlowDto } from '@/collection-flow/dto/update-flow-input.dto';
import { GetFlowConfigurationDto } from '@/collection-flow/dto/get-flow-configuration-input.dto';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { UpdateConfigurationDto } from '@/collection-flow/dto/update-configuration-input.dto';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly adapterManager: WorkflowAdapterManager,
  ) {}

  @common.Post('/authorize')
  async authorizeUser(
    @common.Body() dto: AuthorizeDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<EndUser> {
    return this.service.authorize({ email: dto.email, flowType: dto.flowType }, currentProjectId);
  }

  @common.Get('/active-flow')
  async getActiveFlow(
    @common.Query() query: GetActiveFlowDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const activeWorkflow = await this.service.getActiveFlow(
      {
        endUserId: query.endUserId,
        workflowRuntimeDefinitionId: query.flowType,
      },
      projectIds,
    );

    try {
      const adapter = this.adapterManager.getAdapter(query.flowType);
      return {
        result: activeWorkflow ? adapter.serialize(activeWorkflow) : null,
      };
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(`${query.flowType} is not supported.`);
      }
      throw error;
    }
  }

  @common.Get('/configuration')
  async getFlowConfiguration(
    @common.Query() query: GetFlowConfigurationDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<FlowConfigurationModel> {
    return this.service.getFlowConfiguration(query.flowType, projectIds);
  }

  @common.Put('/configuration/:configurationId')
  async updateFlowConfiguration(
    @common.Param('configurationId') configurationId: string,
    @common.Body() dto: UpdateConfigurationDto,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.service.updateFlowConfiguration(
      configurationId,
      dto.steps,
      projectIds,
      currentProjectId,
    );
  }

  @common.Put('/:flowId')
  async updateFlow(
    @common.Param('flowId') flowId: string,
    @common.Body() dto: UpdateFlowDto,
    @common.Request() request: any,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    try {
      const adapter = this.adapterManager.getAdapter(dto.flowType);

      return this.service.updateFlow(
        adapter,
        dto.payload,
        flowId,
        currentProjectId,
        request.user.customer as Customer,
      );
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(`${dto.flowType} is not supported.`);
      }

      throw error;
    }
  }

  @common.Post('finish/:flowId')
  async finishFlow(
    @common.Param('flowId') flowId: string,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.service.finishFlow(flowId, projectIds, currentProjectId);
  }

  @common.Post('resubmit/:flowId')
  async resubmitFlow(
    @common.Param('flowId') flowId: string,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.service.resubmitFlow(flowId, projectIds, currentProjectId);
  }
}
