import * as common from '@nestjs/common';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { UpdateFlowDto } from '@/collection-flow/dto/update-flow-input.dto';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { UpdateConfigurationDto } from '@/collection-flow/dto/update-configuration-input.dto';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { WorkflowService } from '@/workflow/workflow.service';
import { EndUserService } from '@/end-user/end-user.service';
import { BusinessService } from '@/business/business.service';
import { FinishFlowDto } from '@/collection-flow/dto/finish-flow.dto';

@Public()
@UseTokenAuthGuard()
@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly adapterManager: WorkflowAdapterManager,
    protected readonly workflowService: WorkflowService,
    protected readonly endUserService: EndUserService,
    protected readonly businessService: BusinessService,
  ) {}

  @common.Get('/customer')
  async getCustomer(@TokenScope() tokenScope: ITokenScope) {
    return this.service.getCustomerDetails(tokenScope.projectId);
  }

  @common.Get('/user')
  async getUser(@TokenScope() tokenScope: ITokenScope) {
    return this.service.getUser(tokenScope.endUserId, tokenScope.projectId);
  }

  @common.Get('/active-flow')
  async getActiveFlow(@TokenScope() tokenScope: ITokenScope) {
    const activeWorkflow = await this.service.getActiveFlow(tokenScope.workflowRuntimeDataId, [
      tokenScope.projectId,
    ]);

    if (!activeWorkflow) throw new common.InternalServerErrorException('Workflow not found.');

    try {
      const adapter = this.adapterManager.getAdapter(activeWorkflow.workflowDefinitionId);
      return {
        result: activeWorkflow ? adapter.serialize(activeWorkflow) : null,
      };
    } catch (error) {
      if (error instanceof UnsupportedFlowTypeException) {
        throw new common.BadRequestException(
          `${activeWorkflow.workflowDefinitionId as string} is not supported.`,
        );
      }
      throw error;
    }
  }

  @common.Get('/context')
  async getContext(@TokenScope() tokenScope: ITokenScope) {
    return await this.workflowService.getWorkflowRuntimeDataById(
      tokenScope.workflowRuntimeDataId,
      { select: { context: true, state: true } },
      [tokenScope.projectId],
    );
  }

  @common.Get('/configuration')
  async getFlowConfiguration(
    @TokenScope() tokenScope: ITokenScope,
  ): Promise<FlowConfigurationModel> {
    const workflow = await this.service.getActiveFlow(tokenScope.workflowRuntimeDataId, [
      tokenScope.projectId,
    ]);

    if (!workflow) throw new common.InternalServerErrorException('Workflow not found.');

    return this.service.getFlowConfiguration(workflow.workflowDefinitionId, [tokenScope.projectId]);
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

  @common.Put('')
  async updateFlow(@common.Body() payload: UpdateFlowDto, @TokenScope() tokenScope: ITokenScope) {
    return await this.service.updateWorkflowRuntimeData(payload, tokenScope);
  }

  @common.Put('/sync')
  async syncWorkflow(@common.Body() payload: UpdateFlowDto, @TokenScope() tokenScope: ITokenScope) {
    return await this.service.syncWorkflow(payload, tokenScope);
  }

  @common.Post('/send-event')
  async finishFlow(@TokenScope() tokenScope: ITokenScope, @common.Body() body: FinishFlowDto) {
    return await this.workflowService.event(
      {
        id: tokenScope.workflowRuntimeDataId,
        name: body.eventName,
      },
      [tokenScope.projectId],
      tokenScope.projectId,
    );
  }

  @common.Post('resubmit')
  async resubmitFlow(@TokenScope() tokenScope: ITokenScope) {
    return this.service.resubmitFlow(
      tokenScope.workflowRuntimeDataId,
      [tokenScope.projectId],
      tokenScope.projectId,
    );
  }
}
