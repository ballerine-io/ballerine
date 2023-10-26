import { Prisma, PrismaClient } from '@prisma/client';
import { kycDynamicExample } from './kyc-dynamic-process-example';
import { env } from '../../src/env';
import { StateTag } from '@ballerine/common';
import { generateDynamicUiTest } from './ui-definition/ui-kyb-parent-dynamic-example';

export const kybParentDynamicExample = {
  id: 'dynamic_kyb_parent_example',
  name: 'dynamic_kyb_parent_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_parent_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          COLLECTION_FLOW_FINISHED: 'manual_review',
        },
      },
      run_ubos: {
        on: {
          CONTINUE: [{ target: 'run_kyb_enrichment' }],
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      run_kyb_enrichment: {
        on: {
          KYB_DONE: [{ target: 'pending_kyc_response_to_finish' }],
          // TODO: add 404 handling
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      pending_kyc_response_to_finish: {
        on: {
          KYC_RESPONDED: [
            {
              target: 'manual_review',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'length(childWorkflows.dynamic_kyc_example.*.[result][]) == length(childWorkflows.dynamic_kyc_example.*[])',
                },
              },
            },
          ],
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          revision: 'revision',
        },
      },
      auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      revision: {
        tags: [StateTag.REVISION],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'open_corporates',
        pluginKind: 'kyb',
        url: `${env.UNIFIED_API_URL}/companies`,
        method: 'GET',
        stateNames: ['run_kyb_enrichment'],
        successAction: 'KYB_DONE',
        errorAction: 'FAILED',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                countryOfIncorporation: entity.data.countryOfIncorporation,
                companyNumber: entity.data.registrationNumber,
                state: entity.data.additionalInfo.company.state
                vendor: 'open-corporates'
                }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@', // jmespath
            },
          ],
        },
      },
    ],
    childWorkflowPlugins: [
      {
        pluginKind: 'child',
        name: 'veriff_kyc_child_plugin',
        definitionId: kycDynamicExample.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '@',
          },
        ],
        initEvent: 'start',
      },
    ],
    commonPlugins: [
      {
        pluginKind: 'iterative',
        name: 'ubos_iterractive',
        actionPluginName: 'veriff_kyc_child_plugin',
        stateNames: ['run_ubos'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: 'entity.data.additionalInfo.ubos',
          },
        ],
        successAction: 'CONTINUE',
        errorAction: 'FAILED',
      },
    ],
  },
  config: {
    childCallbackResults: [
      {
        definitionId: kycDynamicExample.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '{childResult: entity.data, vendorResult: hook.data}', // jmespath
          },
        ],
        deliverEvent: 'KYC_RESPONDED',
      },
    ],
  },
} as const satisfies Prisma.WorkflowDefinitionUncheckedCreateInput;
export const generateParentKybWithKycs = async (prismaClient: PrismaClient, projectId?: string) => {
  const kybDynamicExample = {
    ...kybParentDynamicExample,
    isPublic: projectId ? false : true,
    projectId: projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await generateDynamicUiTest(prismaClient, workflow.id, projectId || workflow.projectId);
  return workflow;
};
