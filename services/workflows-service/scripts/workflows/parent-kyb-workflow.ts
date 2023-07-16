import { PrismaClient } from '@prisma/client';
import { kycDynamicExample } from './kyc-dynamic-process-example';

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
          start: 'run_ubos',
        },
      },
      run_kyb_enrichment: {
        on: {
          KYB_DONE: [{ target: 'run_ubos' }],
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      run_ubos: {
        on: {
          PENDING_KYC: [{ target: 'pending_kyc_response_to_finish' }],
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
        type: 'final' as const,
      },
      auto_reject: {
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'open_corporates',
        pluginType: 'kyb',
        url: `{secret.KYB_API_URL}/companies`,
        method: 'GET',
        stateNames: ['run_kyb'],
        successAction: 'KYB_DONE',
        errorAction: 'FAILED',
        headers: { Authorization: 'Bearer {secret.KYB_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              countryOfIncorporation: entity.countryOfIncorporation,
              companyNumber: entity.companyName,
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
        pluginType: 'iterative',
        name: 'ubos_iterractive',
        actionPluginName: 'veriff_kyc_child_plugin',
        stateNames: ['run_ubos'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: 'entity.data.additionalInfo.ubos',
          },
        ],
        successAction: 'PENDING_KYC',
        errorAction: 'FAILED',
      },
    ],
  },
  config: {
    childCallbackResults: [
      {
        definitionName: kycDynamicExample.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '{childEntity: entity.data, veriff_result: pluginsOutput.request_kyc}', // jmespath
          },
        ],
        deliverEvent: 'KYC_RESPONDED',
      },
    ],
  },
};
export const generateParentKybWithKycs = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kybParentDynamicExample,
  });
};
