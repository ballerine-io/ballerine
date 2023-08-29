import { BusinessService } from '@/business/business.service';
import { UpdateFlowPayload } from '@/collection-flow/dto/update-flow-input.dto';
import { recursiveMerge } from '@/collection-flow/helpers/recursive-merge';
import { FlowConfigurationModel } from '@/collection-flow/models/flow-configuration.model';
import { FlowStepModel } from '@/collection-flow/models/flow-step.model';
import { GetActiveFlowParams, SigninCredentials } from '@/collection-flow/types/params';
import { IWorkflowAdapter } from '@/collection-flow/workflow-adapters/abstract-workflow-adapter';
import { KYBParentKYCSessionExampleFlowData } from '@/collection-flow/workflow-adapters/kyb_parent_kyc_session_example/kyb_parent_kyc_session_example.model';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { EndUserService } from '@/end-user/end-user.service';
import { NotFoundException } from '@/errors';
import { TProjectIds } from '@/types';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { Injectable } from '@nestjs/common';
import { Business, Customer, EndUser } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import keyBy from 'lodash/keyBy';

@Injectable()
export class CollectionFlowService {
  constructor(
    protected readonly logger: AppLoggerService,
    protected readonly endUserService: EndUserService,
    protected readonly workflowRuntimeDataRepository: WorkflowRuntimeDataRepository,
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    protected readonly workflowService: WorkflowService,
    protected readonly businessService: BusinessService,
  ) {}

  async authorize(credentials: SigninCredentials, projectIds: TProjectIds): Promise<EndUser> {
    const existingEndUser = await this.endUserService.getByEmail(credentials.email, projectIds);

    if (!existingEndUser) {
      const newUser = await this.initializeNewEndUser(credentials, projectIds);

      await this.workflowService.createOrUpdateWorkflowRuntime({
        workflowDefinitionId: credentials.flowType,
        context: {
          entity: {
            endUserId: newUser.id,
            ballerineEntityId: newUser.businesses.at(-1)?.id,
            type: 'business',
            data: {},
          },
          documents: [],
        },
        projectIds,
      });

      return newUser;
    }

    return existingEndUser;
  }

  private async initializeNewEndUser(credentials: SigninCredentials, projectIds: TProjectIds) {
    const endUser = await this.endUserService.createWithBusiness(
      {
        firstName: '',
        lastName: '',
        email: credentials.email,
        companyName: '',
      },
      projectIds,
    );

    return endUser;
  }

  async getFlowConfiguration(configurationId: string): Promise<FlowConfigurationModel> {
    const workflowDefinition = await this.workflowService.getWorkflowDefinitionById(
      configurationId,
    );

    return plainToClass(FlowConfigurationModel, {
      id: workflowDefinition.id,
      steps:
        workflowDefinition.definition?.states?.data_collection?.metadata?.uiSettings?.multiForm
          ?.steps || [],
      documentConfigurations:
        workflowDefinition.definition?.states?.data_collection?.metadata?.uiSettings.multiForm
          .documents || [],
    });
  }

  async updateFlowConfiguration(
    configurationId: string,
    steps: FlowStepModel[],
  ): Promise<FlowConfigurationModel> {
    const definition = await this.workflowDefinitionRepository.findById(configurationId);
    if (!definition) throw new NotFoundException();

    const providedStepsMap = keyBy(steps, 'key');

    const persistedSteps =
      definition.definition.states?.data_collection?.metadata?.uiSettings?.multiForm?.steps || [];

    const mergedSteps = persistedSteps.map((step: any) => {
      const stepToMergeIn = providedStepsMap[step.key];

      if (stepToMergeIn) {
        return recursiveMerge(step, stepToMergeIn);
      }

      return step;
    });

    const updatedDefinition = await this.workflowDefinitionRepository.updateById(configurationId, {
      data: {
        definition: {
          ...definition.definition,
          states: {
            ...definition.definition?.states,
            data_collection: {
              ...definition.definition?.states?.data_collection,
              metadata: {
                uiSettings: {
                  multiForm: {
                    steps: mergedSteps,
                  },
                },
              },
            },
          },
        },
      },
    });

    return plainToClass(FlowConfigurationModel, {
      id: updatedDefinition.id,
      steps:
        updatedDefinition.definition?.states?.data_collection?.metadata?.uiSettings?.multiForm
          ?.steps || [],
    });
  }

  async getActiveFlow(
    { endUserId, workflowRuntimeDefinitionId }: GetActiveFlowParams,
    projectIds: TProjectIds,
  ) {
    const endUser = (await this.endUserService.getById(endUserId, {
      include: { businesses: true },
    })) as EndUser & { businesses: Business[] };

    if (!endUser || !endUser.businesses.length) return null;

    const query = {
      endUserId: endUser.id,
      ...{
        workflowDefinitionId: workflowRuntimeDefinitionId,
        businessId: endUser.businesses.at(-1)!.id,
      },
      projectIds,
    };

    this.logger.log(`Getting last active workflow`, query);

    const workflowData = await this.workflowRuntimeDataRepository.findLastActive(query);

    this.logger.log('Last active workflow', { workflowId: workflowData ? workflowData.id : null });

    return workflowData ? workflowData : null;
  }

  async updateFlow(
    adapter: IWorkflowAdapter,
    updatePayload: UpdateFlowPayload,
    flowId: string,
    projectIds: TProjectIds,
    customer: Customer,
  ) {
    const workflow = await this.workflowRuntimeDataRepository.findById(flowId);

    if (!workflow) throw new NotFoundException();

    const flowData = plainToClass(KYBParentKYCSessionExampleFlowData, {
      id: flowId,
      state: updatePayload.flowState,
      flowData: updatePayload.dynamicData,
      mainRepresentative: updatePayload.mainRepresentative,
      documents: updatePayload.documents,
      ubos: updatePayload.ubos,
      flowState: updatePayload.flowState,
      businessData: updatePayload.businessData,
    });

    const workflowData = adapter.deserialize(flowData as any, workflow, customer);

    await this.businessService.updateById(workflow.businessId, {
      data: updatePayload.businessData,
    });

    await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: workflowData.workflowDefinitionId,
      context: workflowData.context,
      projectIds,
    });

    return flowData;
  }

  async finishFlow(flowId: string, projectIds: TProjectIds) {
    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(flowId);
    const updatedRuntime = await this.workflowService.updateContextById(workflowRuntimeData.id, {
      ...workflowRuntimeData.context,
      entity: {
        ...workflowRuntimeData.context.entity,
        data: {
          ...workflowRuntimeData.context.entity.data,
          __isFinished: true,
        },
      },
    });

    void this.workflowService.event({ id: flowId, name: 'start' }, projectIds);
    return updatedRuntime;
  }

  async resubmitFlow(flowId: string, projectIds: TProjectIds) {
    await this.workflowService.event({ id: flowId, name: 'RESUBMITTED' }, projectIds);
  }
}
