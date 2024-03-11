import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';

export const composeKybWithAssociatedCompaniesDefinition = ({
  projectId,
  kybChildWorkflowDefinitionId,
  kycChildWorkflowDefinitionId,
  definitionName,
  definitionId,
}: {
  projectId: string;
  definitionName: string;
  definitionId: string;
  kybChildWorkflowDefinitionId: string;
  kycChildWorkflowDefinitionId: string;
}) => {
  return {
    id: definitionId,
    name: definitionName,
    version: 1,
    variant: WorkflowDefinitionVariant.KYB,
    definitionType: 'statechart-json',
    definition: {
      id: `${definitionId}_v1`,
      predictableActionArguments: true,
      initial: 'collection_flow',
      context: {
        documents: [],
      },
      states: {
        collection_flow: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            COLLECTION_FLOW_FINISHED: [{ target: 'create_kyc_workflows' }],
          },
        },
        create_kyc_workflows: {
          on: {
            KYC_CREATED: [{ target: 'create_kyb_workflows' }],
            KYC_FAILED: [{ target: 'failed' }],
          },
        },
        create_kyb_workflows: {
          on: {
            ASSOCIATED_COMPANIES_CREATED: [{ target: 'manual_review' }],
            ASSOCIATED_COMPANIES_FAILED: [{ target: 'failed' }],
          },
        },
        manual_review: {
          tags: [StateTag.MANUAL_REVIEW],
          on: {
            approve: 'approved',
            reject: 'rejected',
            revision: 'revision',
            KYC_IN_PROGRESS: 'pending_kyc_response',
            ASSOCIATED_COMPANY_IN_PROGRESS: 'pending_kyb_response',
            KYC_IN_REVISION: 'revision',
            ASSOCIATED_COMPANY_IN_REVISION: 'revision',
          },
        },
        pending_kyc_response: {
          tags: [StateTag.PENDING_PROCESS],
          on: {
            KYC_RESPONDED: 'manual_review',
          },
        },
        pending_kyb_response: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            ASSOCIATED_COMPANY_KYB_FINISHED: 'manual_review',
          },
        },
        failed: {
          tags: [StateTag.FAILURE],
          type: 'final' as const,
        },
        approved: {
          tags: [StateTag.APPROVED],
          type: 'final' as const,
        },
        revision: {
          tags: [StateTag.REVISION],
          on: {
            COLLECTION_FLOW_FINISHED: [{ target: 'manual_review' }],
            KYC_RESPONDED: [{ target: 'manual_review' }],
            ASSOCIATED_COMPANY_KYB_FINISHED: [{ target: 'manual_review' }],
            reject: 'rejected',
          },
        },
        rejected: {
          tags: [StateTag.REJECTED],
          type: 'final' as const,
        },
      },
    },
    extensions: {
      childWorkflowPlugins: [
        {
          pluginKind: 'child',
          name: 'kyc_child_plugin',
          definitionId: kycChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{entity: {data: @, type: 'individual'}}`,
            },
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data',
                  target: 'entity.data',
                  method: 'omit',
                  value: ['workflowRuntimeId', 'workflowRuntimeConfig'],
                },
              ],
            },
          ],
        },
        {
          pluginKind: 'child',
          name: 'associated_company_child_plugin',
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: `{entity: {data: @, type: 'business'}}`,
            },
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data',
                  target: 'entity.data',
                  method: 'omit',
                  value: ['workflowRuntimeId', 'workflowRuntimeConfig'],
                },
              ],
            },
          ],
        },
      ],
      commonPlugins: [
        {
          pluginKind: 'iterative',
          name: 'ubos_iterative',
          actionPluginName: 'kyc_child_plugin',
          stateNames: ['create_kyc_workflows'],
          iterateOn: [
            {
              transformer: 'jmespath',
              mapping: 'entity.data.additionalInfo.ubos',
            },
          ],
          successAction: 'KYC_CREATED',
          errorAction: 'KYC_FAILED',
        },
        {
          pluginKind: 'iterative',
          name: 'associated_company_iterative',
          actionPluginName: 'associated_company_child_plugin',
          stateNames: ['create_kyb_workflows'],
          iterateOn: [
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'entity.data.additionalInfo.associatedCompanies',
                  target: 'entity.data.additionalInfo.associatedCompanies',
                  method: 'mergeArrayEachItemWithValue',
                  options: {
                    mapJmespath: 'entity.data.additionalInfo.associatedCompanies',
                    mergeWithJmespath:
                      '{ additionalInfo: { customerName: metadata.customerName, kybCompanyName: entity.data.companyName } }',
                  },
                },
              ],
            },
            {
              transformer: 'jmespath',
              mapping: 'entity.data.additionalInfo.associatedCompanies',
            },
          ],
          successAction: 'ASSOCIATED_COMPANIES_CREATED',
          errorAction: 'ASSOCIATED_COMPANIES_FAILED',
        },
      ],
    },
    config: {
      isExample: true,
      createCollectionFlowToken: true,
      workflowLevelResolution: true,
      childCallbackResults: [
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['manual_review'],
          deliverEvent: 'ASSOCIATED_COMPANY_KYB_FINISHED',
        },
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['pending_associated_kyb_collection_flow'],
          deliverEvent: 'ASSOCIATED_COMPANY_IN_PROGRESS',
        },
        {
          definitionId: kybChildWorkflowDefinitionId,
          transformers: [
            {
              transformer: 'jmespath',
              mapping: '{childEntity: entity.data}', // jmespath
            },
          ],
          persistenceStates: ['revision'],
          deliverEvent: 'revision',
        },
        {
          definitionId: kycChildWorkflowDefinitionId,
          persistenceStates: ['manual_review'],
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
            },
          ],
          deliverEvent: 'KYC_RESPONDED',
        },
        {
          definitionId: kycChildWorkflowDefinitionId,
          persistenceStates: ['pending_kyc_flow'],
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
            },
          ],
          deliverEvent: 'KYC_IN_PROGRESS',
        },
        {
          definitionId: kycChildWorkflowDefinitionId,
          persistenceStates: ['revision'],
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
            },
          ],
          deliverEvent: 'KYC_REVISION',
        },
      ],
      isCaseOverviewEnabled: true,
    },
    contextSchema: {
      type: 'json-schema',
      schema: defaultContextSchema,
    },
    isPublic: !projectId,
    projectId: projectId,
  };
};
