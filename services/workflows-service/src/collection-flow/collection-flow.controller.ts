import * as common from '@nestjs/common';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AuthorizeDto } from '@/collection-flow/dto/authorize-input.dto';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { EndUser } from '@prisma/client';
import { GetActiveFlowDto } from '@/collection-flow/dto/get-active-workflow-input.dto';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { UpdateFlowDto } from '@/collection-flow/dto/update-flow-input.dto';
import { GetFlowConfigurationDto } from '@/collection-flow/dto/get-flow-configuration-input.dto';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { UpdateConfigurationDto } from '@/collection-flow/dto/update-configuration-input.dto';

@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly adapterManager: WorkflowAdapterManager,
  ) {}

  @common.Post('/authorize')
  @UseKeyAuthGuard()
  async authorizeUser(@common.Body() dto: AuthorizeDto): Promise<EndUser> {
    return this.service.authorize({ email: dto.email, flowType: dto.flowType });
  }

  @common.Get('/active-flow')
  @UseKeyAuthGuard()
  async getActiveFlow(@common.Query() query: GetActiveFlowDto) {
    const activeWorkflow = await this.service.getActiveFlow({
      endUserId: query.endUserId,
      workflowRuntimeDefinitionId: query.workflowRuntimeDefinitionId,
    });

    try {
      const adapter = this.adapterManager.getAdapter(query.workflowRuntimeDefinitionId);
      return {
        result: activeWorkflow ? adapter.serialize(activeWorkflow) : null,
      };
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(
          `${query.workflowRuntimeDefinitionId} is not supported.`,
        );
      }
      throw error;
    }
  }

  @common.Get('/configuration')
  @UseKeyAuthGuard()
  async getFlowConfiguration(
    @common.Query() query: GetFlowConfigurationDto,
  ): Promise<FlowConfigurationModel> {
    return this.service.getFlowConfiguration(query.flowType);
  }

  @common.Put('/configuration/:configurationId')
  @UseKeyAuthGuard()
  async updateFlowConfiguration(
    @common.Param('configurationId') configurationId: string,
    @common.Body() dto: UpdateConfigurationDto,
  ) {
    return this.service.updateFlowConfiguration(configurationId, dto.steps);
  }

  @common.Put('/:flowId')
  @UseKeyAuthGuard()
  async updateFlow(@common.Param('flowId') flowId: string, @common.Body() dto: UpdateFlowDto) {
    try {
      const adapter = this.adapterManager.getAdapter(dto.flowType);

      return this.service.updateFlow(adapter, dto.payload, flowId);
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(`${dto.flowType} is not supported.`);
      }

      throw error;
    }
  }
}
