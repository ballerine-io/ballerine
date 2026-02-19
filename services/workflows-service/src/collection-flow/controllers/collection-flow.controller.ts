import { CollectionFlowService } from '@/collection-flow/services/collection-flow.service';
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
import {
  AnyRecord,
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  DefaultContextSchema,
  TCollectionFlowState,
  TCollectionFlowStep,
} from '@ballerine/common';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import * as common from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CollectionFlowMissingException } from '../exceptions/collection-flow-missing.exception';
import { CollectionFlowStateService } from '../services/collection-flow-state.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentService } from '@/document/document.service';
import { isObject } from '@ballerine/common';
import { merge } from 'lodash';

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
    protected readonly collectionFlowStateService: CollectionFlowStateService,
    protected readonly prismaService: PrismaService,
    protected readonly documentService: DocumentService,
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

    // Refresh document URLs on every active-flow read so reopened sessions do not
    // return expired links from persisted context.
    await this.synthesizeContextDocumentsFromLatestFiles({
      context: (activeWorkflow.context ?? {}) as AnyRecord,
      workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
      projectId: tokenScope.projectId,
    });

    try {
      const adapter = this.adapterManager.getAdapter(activeWorkflow.workflowDefinitionId);

      return {
        result: adapter.serialize(activeWorkflow),
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
      const { eventName, context: incomingContext = {} } = body;
      const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
        tokenScope.workflowRuntimeDataId,
        { select: { context: true } },
        [tokenScope.projectId],
      );
      // final-submission payloads may be partial; preserve runtime context fields that are not sent
      // by clients (e.g. entity/customData) before updating runtime data.
      const context = merge(
        {},
        (workflowRuntimeData?.context ?? {}) as Record<string, unknown>,
        incomingContext ?? {},
      ) as AnyRecord;

      const collectionFlowState = ((context.collectionFlow as AnyRecord)?.state ??
        {}) as TCollectionFlowState;
      const collectionFlowSteps = Array.isArray(collectionFlowState?.steps)
        ? collectionFlowState.steps
        : [];

      if (collectionFlowState?.status === CollectionFlowStatusesEnum.edit) {
        const pluginsOutput = this.collectionFlowService.removePluginsOutput({
          context: context as DefaultContextSchema,
          plugins: [
            'businessInformation',
            'companySanctions',
            'merchantScreening',
            'merchantMonitoring',
            'riskEvaluation',
          ],
        });

        context.pluginsOutput = pluginsOutput;
      }

      // Collection-flow v2 stores uploaded files in the documents service (DB) rather than directly in
      // `context.documents`. Our SL workflows (and Unified API adapters) expect a legacy-like
      // `context.documents[].pages[].uri` shape, so we synthesize it here from the latest documents.
      //
      // This keeps workflow definitions simple and ensures verification plugins have access to
      // signed URLs immediately after the end-user submits/resubmits their documents.
      await this.synthesizeContextDocumentsFromLatestFiles({
        context: context as AnyRecord,
        workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
        projectId: tokenScope.projectId,
      });

      await this.workflowService.updateWorkflowRuntimeData(
        tokenScope.workflowRuntimeDataId,
        {
          context,
        },
        tokenScope.projectId,
      );

      await this.collectionFlowStateService.updateCollectionFlowState(
        tokenScope.workflowRuntimeDataId,
        {
          ...collectionFlowState,
          steps: collectionFlowSteps.map((step: TCollectionFlowStep) => ({
            ...step,
            state: CollectionFlowStepStatesEnum.completed,
          })),
          status: CollectionFlowStatusesEnum.completed,
        },
        [tokenScope.projectId],
      );

      return this.workflowService.event(
        {
          id: tokenScope.workflowRuntimeDataId,
          name: eventName,
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

  private async synthesizeContextDocumentsFromLatestFiles({
    context,
    workflowRuntimeDataId,
    projectId,
  }: {
    context: AnyRecord;
    workflowRuntimeDataId: string;
    projectId: string;
  }) {
    try {
      const latestDocs = await this.documentService.getLatestDocumentsWithFilesByWorkflowId(
        workflowRuntimeDataId,
        [projectId],
      );

      const latestDocsWithSignedUrls = await this.documentService.fetchDocumentsFiles({
        documents: latestDocs as any,
        format: 'signed-url',
      });

      context.documents = (latestDocsWithSignedUrls as any[]).map(doc => ({
        category: doc.category,
        type: doc.type,
        issuer: { country: doc.issuingCountry || 'SL' },
        pages: (doc.files ?? [])
          .slice()
          .sort((a: any, b: any) => {
            const variantOrder = (v: string) => (v === 'front' ? 0 : v === 'back' ? 1 : 2);
            return variantOrder(a.variant) - variantOrder(b.variant) || (a.page || 0) - (b.page || 0);
          })
          .map((file: any) => ({
            provider: 'http',
            uri: file.imageUrl,
            type: file.mimeType,
            metadata: {
              side: file.variant,
              pageNumber: file.page != null ? String(file.page) : undefined,
            },
          })),
        properties: isObject(doc.properties) ? doc.properties : {},
        decision: doc.decision
          ? {
              status: doc.decision,
              comment: doc.comment ?? undefined,
            }
          : undefined,
      }));
    } catch (error) {
      // Non-fatal: allow flows without documents (or with external/programmatic docs) to proceed.
      this.appLogger.warn('Failed to synthesize context.documents from documents service', {
        workflowRuntimeDataId,
        error,
      });
    }
  }

  @common.Get('/workflow-id')
  async getWorkflowId(@TokenScope() tokenScope: ITokenScopeWithEndUserId) {
    return tokenScope.workflowRuntimeDataId;
  }
}
