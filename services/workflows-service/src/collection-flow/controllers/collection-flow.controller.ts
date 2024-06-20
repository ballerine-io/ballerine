import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { FinishFlowDto } from '@/collection-flow/dto/finish-flow.dto';
import { GetFlowConfigurationInputDto } from '@/collection-flow/dto/get-flow-configuration-input.dto';
import { UpdateConfigurationDto } from '@/collection-flow/dto/update-configuration-input.dto';
import { UpdateContextInputDto } from '@/collection-flow/dto/update-context-input.dto';
import { UpdateFlowDto, UpdateFlowLanguageDto } from '@/collection-flow/dto/update-flow-input.dto';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import type { TProjectIds } from '@/types';
import { WorkflowService } from '@/workflow/workflow.service';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@common.Controller('collection-flow')
export class ColectionFlowController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly adapterManager: WorkflowAdapterManager,
    protected readonly workflowService: WorkflowService,
  ) {}

  @UseTokenAuthGuard()
  @common.Get('/customer')
  async getCustomer(@TokenScope() tokenScope: ITokenScope) {
    return this.service.getCustomerDetails(tokenScope.projectId);
  }

  @UseTokenAuthGuard()
  @common.Get('/user')
  async getUser(@TokenScope() tokenScope: ITokenScope) {
    return this.service.getUser(tokenScope.endUserId, tokenScope.projectId);
  }

  @UseTokenAuthGuard()
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

  @UseTokenAuthGuard()
  @common.Get('/context')
  async getContext(@TokenScope() tokenScope: ITokenScope) {
    return await this.workflowService.getWorkflowRuntimeDataById(
      tokenScope.workflowRuntimeDataId,
      { select: { context: true, state: true } },
      [tokenScope.projectId],
    );
  }

  @UseTokenAuthGuard()
  @common.Get('/configuration/:language')
  async getFlowConfiguration(
    @TokenScope() tokenScope: ITokenScope,
    @common.Param() params: GetFlowConfigurationInputDto,
  ): Promise<FlowConfigurationModel> {
    const workflow = await this.service.getActiveFlow(tokenScope.workflowRuntimeDataId, [
      tokenScope.projectId,
    ]);

    if (!workflow) {
      throw new common.InternalServerErrorException('Workflow not found.');
    }

    return this.service.getFlowConfiguration(
      workflow.workflowDefinitionId,
      workflow.context,
      params.language,
      [tokenScope.projectId],
    );
  }

  @UseCustomerAuthGuard()
  @common.Patch('/configuration/:configurationId')
  async updateFlowConfiguration(
    @common.Param('configurationId') configurationId: string,
    @common.Body() payload: UpdateConfigurationDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return this.service.updateUIDefinition(configurationId, payload, projectIds);
  }

  @UseTokenAuthGuard()
  @common.Put('/language')
  async updateFlowLanguage(
    @common.Body() { language }: UpdateFlowLanguageDto,
    @TokenScope() tokenScope: ITokenScope,
  ) {
    return await this.service.updateWorkflowRuntimeLanguage(language, tokenScope);
  }

  @UseTokenAuthGuard()
  @common.Put('/sync')
  async syncWorkflow(@common.Body() payload: UpdateFlowDto, @TokenScope() tokenScope: ITokenScope) {
    return await this.service.syncWorkflow(payload, tokenScope);
  }

  @UseTokenAuthGuard()
  @common.Patch('/sync/context')
  async updateContextById(
    @common.Body() { context }: UpdateContextInputDto,
    @TokenScope() tokenScope: ITokenScope,
  ) {
    return await this.workflowService.event(
      {
        id: tokenScope.workflowRuntimeDataId,
        name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
        payload: {
          newContext: context,
          arrayMergeOption: ARRAY_MERGE_OPTION.BY_ID,
        },
      },
      [tokenScope.projectId],
      tokenScope.projectId,
    );
  }

  @UseTokenAuthGuard()
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

  @UseTokenAuthGuard()
  @common.Post('resubmit')
  async resubmitFlow(@TokenScope() tokenScope: ITokenScope) {
    await this.workflowService.event(
      { id: tokenScope.workflowRuntimeDataId, name: 'RESUBMITTED' },
      [tokenScope.projectId],
      tokenScope.projectId,
    );
  }
}
