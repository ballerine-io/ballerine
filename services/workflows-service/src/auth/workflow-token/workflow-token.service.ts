import { Injectable } from '@nestjs/common';

import type { InputJsonValue, PrismaTransaction, TProjectId } from '@/types';
import { CustomerService } from '@/customer/customer.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { buildCollectionFlowState, getOrderedSteps } from '@ballerine/common';
import { env } from '@/env';
import { WORKFLOW_FINAL_STATES } from '@/workflow/consts';
import { Prisma, UiDefinitionContext } from '@prisma/client';

@Injectable()
export class WorkflowTokenService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly uiDefinitionService: UiDefinitionService,
    private readonly workflowTokenRepository: WorkflowTokenRepository,
    private readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
  ) {}

  async create(
    projectId: TProjectId,
    data: Parameters<typeof this.workflowTokenRepository.create>[1],
    transaction?: PrismaTransaction,
  ) {
    const { workflowRuntimeDataId } = data;

    const existingTokensForWorkflowRuntime = await this.count(
      { where: { workflowRuntimeDataId } },
      projectId,
    );

    const workflowToken = await this.workflowTokenRepository.create(projectId, data, transaction);

    if (existingTokensForWorkflowRuntime === 0) {
      const { workflowDefinitionId, context } = await this.workflowRuntimeDataRepository.findById(
        workflowRuntimeDataId,
        { select: { workflowDefinitionId: true, context: true } },
        [projectId],
        transaction,
      );

      let collectionFlow;
      try {
        const [uiDefinition, customer] = await Promise.all([
          this.uiDefinitionService.getByWorkflowDefinitionId(
            workflowDefinitionId,
            UiDefinitionContext.collection_flow,
            [projectId],
          ),
          this.customerService.getByProjectId(projectId),
        ]);

        collectionFlow = buildCollectionFlowState({
          apiUrl: env.APP_API_URL,
          steps: uiDefinition?.definition
            ? getOrderedSteps(
                (uiDefinition?.definition as Prisma.JsonObject)?.definition as Record<
                  string,
                  Record<string, unknown>
                >,
                { finalStates: [...WORKFLOW_FINAL_STATES] },
              ).map(stepName => ({
                stateName: stepName,
              }))
            : [],
          additionalInformation: {
            customerCompany: customer.displayName,
          },
        });
      } catch (error) {
        collectionFlow = buildCollectionFlowState({
          apiUrl: env.APP_API_URL,
          steps: [],
          additionalInformation: {
            customerCompany: '',
          },
        });
      }

      await this.workflowRuntimeDataRepository.updateStateById(
        workflowRuntimeDataId,
        {
          data: {
            context: {
              ...context,
              collectionFlow,
              metadata: {
                ...(context.metadata ?? {}),
                token: workflowToken.token,
                collectionFlowUrl: env.COLLECTION_FLOW_URL,
                webUiSDKUrl: env.WEB_UI_SDK_URL,
              },
            } as InputJsonValue,
            projectId,
          },
        },
        transaction,
      );
    }

    return workflowToken;
  }

  async findByToken(token: string) {
    return await this.workflowTokenRepository.findByTokenUnscoped(token);
  }

  async findFirstByWorkflowRuntimeDataIdUnscoped(token: string) {
    return await this.workflowTokenRepository.findFirstByWorkflowRuntimeDataIdUnscoped(token);
  }

  async findByTokenWithExpiredUnscoped(token: string) {
    return await this.workflowTokenRepository.findByTokenWithExpiredUnscoped(token);
  }

  async count(
    args: Parameters<typeof this.workflowTokenRepository.count>[0],
    projectId: TProjectId,
  ) {
    return await this.workflowTokenRepository.count(args, projectId);
  }

  async deleteByToken(token: string) {
    return await this.workflowTokenRepository.deleteByTokenUnscoped(token);
  }

  async updateByToken(
    token: string,
    data: Parameters<typeof this.workflowTokenRepository.updateByToken>[1],
    transaction?: PrismaTransaction,
  ) {
    return await this.workflowTokenRepository.updateByToken(token, data, transaction);
  }
}
