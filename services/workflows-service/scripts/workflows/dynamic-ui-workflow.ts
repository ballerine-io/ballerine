import { PrismaClient } from '@prisma/client';
import { kycEmailSessionDefinition } from './kyc-email-process-example';
import { env } from '../../src/env';

import { defaultContextSchema, StateTag } from '@ballerine/common';
import { generateDynamicUiTest } from './ui-definition/ui-kyb-parent-dynamic-example';

export const dynamicUiWorkflowDefinition = {
  id: 'kyb_dynamic_ui_session_example',
  name: 'kyb_dynamic_ui_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_dynamic_ui_session_example_v1',
    predictableActionArguments: true,
    initial: 'collection_flow',
    context: {
      documents: [],
    },
    states: {
      collection_flow: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          COLLECTION_FLOW_FINISHED: [
            {
              target: 'run_cn_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.additionalInfo.country == `cn`', // @TODO: Work out entity.data.additionalInfo.country with Daniel
                },
              },
            },
            {
              target: 'run_hk_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.additionalInfo.country == `hk`', // @TODO: Work out entity.data.additionalInfo.country with Daniel
                },
              },
            },
            {
              target: 'auto_reject',
            },
          ],
        },
      },
      run_cn_kyb: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          CN_KYB_DONE: [{ target: 'run_vendor_data' }],
          CN_KYB_FAIL: [{ target: 'failure' }],
        },
      },
      run_hk_kyb: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          HK_KYB_HOOK_RESPONDED: [{ target: 'run_vendor_data' }],
          HK_KYB_HOOK_FAILED: [{ target: 'failure' }],
        },
      },
      run_vendor_data: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          VENDOR_DATA_COLLECTION_DONE: [
            {
              target: 'run_ubos',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'pluginsOutput.ubo && pluginsOutput.aml', // @TODO: Work out pluginsOutput.ubo and pluginsOutput.aml (AML does not have resultDestination as it is not async)
                },
              },
            },
          ],
          VENDOR_DATA_COLLECTION_FAIL: [{ target: 'failure' }],
        },
      },
      run_ubos: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          EMAIL_SENT_TO_UBOS: [{ target: 'pending_kyc_response_to_finish' }],
          FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'auto_reject' }],
        },
      },
      pending_kyc_response_to_finish: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_RESPONDED: [
            {
              target: 'manual_review',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[])',
                },
              },
            },
          ],
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'revision',
        },
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
      revision: {
        tags: [StateTag.REVISION],
        on: {
          RESUBMITTED: 'manual_review',
        },
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      failure: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'asia_verify_cn_kyb',
        pluginKind: 'kyb',
        url: `${env.UNIFIED_API_URL}/companies-v2`,
        method: 'GET',
        stateNames: ['run_cn_kyb'],
        successAction: 'CN_KYB_DONE',
        errorAction: 'CN_KYB_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.registrationNumber" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.registrationNumber,
                countryOfIncorporation: 'cn',
                vendor: 'asia-verify'
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
      {
        // @TODO: handle callback
        name: 'asia_verify_hk_kyb',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/companies-v2`,
        method: 'GET',
        stateNames: ['run_hk_kyb'],
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.registrationNumber" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.registrationNumber,
                countryOfIncorporation: 'hk',
                vendor: 'asia-verify'
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/HK_KYB_HOOK_RESPONDED','?resultDestination=pluginsOutput.kyb.result']),
              }`, // jmespath
            },
          ],
        },
      },
      {
        name: 'asia_verify_aml',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.additionalInfo.country}/{entity.data.companyName}/aml`,
        method: 'GET',
        stateNames: ['run_vendor_data'],
        successAction: 'VENDOR_DATA_COLLECTION_DONE',
        errorAction: 'VENDOR_DATA_COLLECTION_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.companyName" and "entity.data.additionalInfo.country" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyName: entity.data.companyName,
                countryOfIncorporation: entity.data.additionalInfo.country,
                vendor: 'asia-verify'
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
      {
        name: 'asia_verify_ubo',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.additionalInfo.country}/{entity.data.companyName}/ubo`,
        method: 'GET',
        stateNames: ['run_vendor_data'],
        successAction: 'VENDOR_DATA_COLLECTION_DONE',
        errorAction: 'VENDOR_DATA_COLLECTION_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              // @TODO: Work out "entity.data.companyName" and "entity.data.additionalInfo.country" with Daniel
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.companyNumber,
                countryOfIncorporation: entity.data.additionalInfo.country,
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/UBO_HOOK_RESPONDED','?resultDestination=pluginsOutput.ubo.result']),
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
      {
        name: 'resubmission_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        stateNames: ['pending_resubmission'],
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              kybCompanyName: entity.data.companyName,
              customerCompanyName: entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.customerCompany,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              resubmissionLink: join('',['https://',entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.normalizedCustomerCompany,'.demo.ballerine.app','/workflowRuntimeId=',workflowRuntimeId,'?resubmitEvent=RESUBMITTED']),
              supportEmail: join('',[entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.normalizedCustomerCompany,'@support.com']),
              from: 'no-reply@ballerine.com',
              name: join(' ',[entity.data.additionalInfo.ubos[0].entity.data.additionalInfo.customerCompany,'Team']),
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: 'd-7305991b3e5840f9a14feec767ea7301',
              revisionReason: documents[].decision[].revisionReason | [0],
              adapter: '${env.MAIL_ADAPTER}'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        },
      },
    ],
    childWorkflowPlugins: [
      {
        pluginKind: 'child',
        name: 'veriff_kyc_child_plugin',
        definitionId: kycEmailSessionDefinition.id,
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
        successAction: 'EMAIL_SENT_TO_UBOS',
        errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
      },
    ],
  },
  config: {
    childCallbackResults: [
      {
        definitionId: kycEmailSessionDefinition.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}', // jmespath
          },
        ],
        persistenceStates: ['kyc_manual_review'],
        deliverEvent: 'KYC_RESPONDED',
      },
    ],
  },
  contextSchema: {
    type: 'json-schema',
    schema: defaultContextSchema,
  },
  isPublic: true,
};
export const generateDynamicUiWorkflow = async (prismaClient: PrismaClient, projectId?: string) => {
  const kybDynamicExample = {
    ...dynamicUiWorkflowDefinition,
    isPublic: !projectId,
    projectId: projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await generateDynamicUiTest(prismaClient, workflow.id, projectId || workflow.projectId);

  return workflow;
};
