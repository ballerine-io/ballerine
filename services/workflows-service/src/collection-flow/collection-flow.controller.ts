import * as common from '@nestjs/common';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AuthorizeDto } from '@/collection-flow/dto/authorize-input.dto';
import { EndUser } from '@prisma/client';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-workflow-input.dto';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { UpdateFlowDto } from '@/collection-flow/dto/update-flow-input.dto';
import { GetFlowConfigurationDto } from '@/collection-flow/dto/get-flow-configuration-input.dto';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { UpdateConfigurationDto } from '@/collection-flow/dto/update-configuration-input.dto';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectIds } from '@/types';
import { UseKeyAuthOrSessionGuard } from '@/common/decorators/use-key-auth-or-session-guard.decorator';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly adapterManager: WorkflowAdapterManager,
  ) {}

  @common.Post('/authorize')
  @UseKeyAuthOrSessionGuard()
  async authorizeUser(
    @common.Body() dto: AuthorizeDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<EndUser> {
    return this.service.authorize({ email: dto.email, flowType: dto.flowType }, projectIds);
  }

  @common.Get('/active-flow')
  @UseKeyAuthOrSessionGuard()
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
  @UseKeyAuthOrSessionGuard()
  async getFlowConfiguration(
    @common.Query() query: GetFlowConfigurationDto,
  ): Promise<FlowConfigurationModel> {
    return this.service.getFlowConfiguration(query.flowType);
  }

  @common.Put('/configuration/:configurationId')
  @UseKeyAuthOrSessionGuard()
  async updateFlowConfiguration(
    @common.Param('configurationId') configurationId: string,
    @common.Body() dto: UpdateConfigurationDto,
  ) {
    return this.service.updateFlowConfiguration(configurationId, dto.steps);
  }

  @common.Put('/:flowId')
  @UseKeyAuthOrSessionGuard()
  async updateFlow(
    @common.Param('flowId') flowId: string,
    @common.Body() dto: UpdateFlowDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    try {
      const adapter = this.adapterManager.getAdapter(dto.flowType);

      return this.service.updateFlow(adapter, dto.payload, flowId, projectIds);
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(`${dto.flowType} is not supported.`);
      }

      throw error;
    }
  }

  @common.Post('finish/:flowId')
  @UseKeyAuthOrSessionGuard()
  async finishFlow(@common.Param('flowId') flowId: string, @ProjectIds() projectIds: TProjectIds) {
    return this.service.finishFlow(flowId, projectIds);
  }
}
