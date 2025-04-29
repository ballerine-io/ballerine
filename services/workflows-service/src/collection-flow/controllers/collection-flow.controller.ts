import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { FinishFlowDto } from '@/collection-flow/dto/finish-flow.dto';
import { GetFlowConfigurationInputDto } from '@/collection-flow/dto/get-flow-configuration-input.dto';
import { UpdateContextInputDto } from '@/collection-flow/dto/update-context-input.dto';
import { UpdateFlowDto, UpdateFlowLanguageDto } from '@/collection-flow/dto/update-flow-input.dto';
import { UnsupportedFlowTypeException } from '@/collection-flow/exceptions/unsupported-flow-type.exception';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import {
  type ITokenScope,
  type ITokenScopeWithEndUserId,
  TokenScope,
} from '@/common/decorators/token-scope.decorator';
import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';
import { EndUserService } from '@/end-user/end-user.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { CollectionFlowStatusesEnum, getCollectionFlowState } from '@ballerine/common';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CollectionFlowMissingException } from '../exceptions/collection-flow-missing.exception';

@UseWorkflowAuthGuard()
@ApiExcludeController()
@common.Controller('collection-flow')
export class CollectionFlowController {
  constructor(
    protected readonly appLogger: AppLoggerService,
    protected readonly workflowService: WorkflowService,
    protected readonly adapterManager: WorkflowAdapterManager,
    protected readonly collectionFlowService: CollectionFlowService,
    protected readonly endUserService: EndUserService,
  ) {}

  @common.Get('/customer')
  async getCustomer(@TokenScope() tokenScope: ITokenScope) {
    return this.collectionFlowService.getCustomerDetails(tokenScope.projectId);
  }

  @common.Get('/user')
  async getUser(@TokenScope() tokenScope: ITokenScopeWithEndUserId) {
    return this.collectionFlowService.getUser(tokenScope.endUserId, tokenScope.projectId);
  }

  @common.Get('/active-flow')
  async getActiveFlow(@TokenScope() tokenScope: ITokenScope) {
    const activeWorkflow = await this.collectionFlowService.getActiveFlow(
      tokenScope.workflowRuntimeDataId,
      [tokenScope.projectId],
    );

    if (!activeWorkflow) {
      throw new common.InternalServerErrorException('Workflow not found.');
    }

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
    return this.collectionFlowService.getCollectionFlowContext(tokenScope);
  }

  @common.Get('/configuration/:language')
  async getFlowConfiguration(
    @TokenScope() tokenScope: ITokenScope,
    @common.Param() params: GetFlowConfigurationInputDto,
  ): Promise<FlowConfigurationModel> {
    const workflow = await this.collectionFlowService.getActiveFlow(
      tokenScope.workflowRuntimeDataId,
      [tokenScope.projectId],
    );

    if (!workflow) {
      throw new common.InternalServerErrorException('Workflow not found.');
    }

    return this.collectionFlowService.getFlowConfiguration(
      workflow.workflowDefinitionId,
      workflow.context,
      params.language,
      [tokenScope.projectId],
      tokenScope,
      workflow.uiDefinitionId ? { where: { id: workflow.uiDefinitionId } } : {},
    );
  }

  @common.Put('/language')
  async updateFlowLanguage(
    @common.Body() { language }: UpdateFlowLanguageDto,
    @TokenScope() tokenScope: ITokenScope,
  ) {
    return await this.collectionFlowService.updateWorkflowRuntimeLanguage(language, tokenScope);
  }

  @common.Put('/sync')
  async syncWorkflow(@common.Body() payload: UpdateFlowDto, @TokenScope() tokenScope: ITokenScope) {
    return await this.collectionFlowService.syncWorkflow(payload, tokenScope);
  }

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

  @common.Post('/final-submission')
  async finalSubmission(@TokenScope() tokenScope: ITokenScope, @common.Body() body: FinishFlowDto) {
    try {
      const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
        tokenScope.workflowRuntimeDataId,
        {},
        [tokenScope.projectId],
      );

      const directors = await Promise.all(
        workflowRuntimeData.context.entity.data.additionalInfo.directors?.map(
          async (director: {
            ballerineEntityId?: string;
            firstName: string;
            lastName: string;
            email: string;
          }) => {
            // If ID is present then entity been created in KYB
            if (director.ballerineEntityId) {
              return director;
            }

            const { id } = await this.endUserService.create({
              data: {
                firstName: director.firstName,
                lastName: director.lastName,
                email: director.email,
                projectId: tokenScope.projectId,
              },
            });

            return {
              ballerineEntityId: id,
              ...director,
            };
          },
        ) || [],
      );

      const ubos = await Promise.all(
        workflowRuntimeData.context.entity.data.additionalInfo.ubos?.map(
          async (ubo: {
            ballerineEntityId?: string;
            firstName: string;
            lastName: string;
            email: string;
          }) => {
            // If ID is present then entity been created in KYB
            if (ubo.ballerineEntityId) {
              return ubo;
            }

            const { id } = await this.endUserService.create({
              data: {
                firstName: ubo.firstName,
                lastName: ubo.lastName,
                email: ubo.email,
                projectId: tokenScope.projectId,
              },
            });

            return {
              ballerineEntityId: id,
              ...ubo,
            };
          },
        ) || [],
      );

      await this.workflowService.event(
        {
          id: tokenScope.workflowRuntimeDataId,
          name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
          payload: {
            newContext: {
              entity: {
                data: {
                  additionalInfo: {
                    directors: directors?.length ? directors : undefined,
                    ubos: ubos?.length ? ubos : undefined,
                  },
                },
              },
            },
            arrayMergeOption: ARRAY_MERGE_OPTION.REPLACE,
          },
        },
        [tokenScope.projectId],
        tokenScope.projectId,
      );

      await this.workflowService.event(
        {
          id: tokenScope.workflowRuntimeDataId,
          name: body.eventName,
        },
        [tokenScope.projectId],
        tokenScope.projectId,
      );

      if (!body.context) {
        return;
      }

      return await this.workflowService.event(
        {
          id: tokenScope.workflowRuntimeDataId,
          name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
          payload: {
            newContext: body.context,
            arrayMergeOption: ARRAY_MERGE_OPTION.REPLACE,
          },
        },
        [tokenScope.projectId],
        tokenScope.projectId,
      );
    } catch (error) {
      if (error instanceof CollectionFlowMissingException) {
        throw error;
      }

      try {
        await this.workflowService.event(
          {
            id: tokenScope.workflowRuntimeDataId,
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            payload: {
              newContext: {
                collectionFlow: {
                  state: {
                    status: CollectionFlowStatusesEnum.failed,
                  },
                },
              },
              arrayMergeOption: ARRAY_MERGE_OPTION.REPLACE,
            },
          },
          [tokenScope.projectId],
          tokenScope.projectId,
        );
      } catch (error) {
        this.appLogger.error(error);
        throw new common.InternalServerErrorException(
          'Failed to set collection flow state as failed.',
        );
      }

      this.appLogger.error(error);
      throw new common.InternalServerErrorException('Failed to update collection flow state.');
    }
  }

  @common.Post('resubmit')
  async resubmitFlow(@TokenScope() tokenScope: ITokenScope) {
    await this.workflowService.event(
      { id: tokenScope.workflowRuntimeDataId, name: 'RESUBMITTED' },
      [tokenScope.projectId],
      tokenScope.projectId,
    );
  }

  @common.Get('/workflow-id')
  async getWorkflowId(@TokenScope() tokenScope: ITokenScopeWithEndUserId) {
    return tokenScope.workflowRuntimeDataId;
  }
}
