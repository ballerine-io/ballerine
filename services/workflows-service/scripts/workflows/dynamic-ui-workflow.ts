import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';
import { kycEmailSessionDefinition } from './kyc-email-process-example';

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
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          START: 'collection_invite',
        },
      },
      collection_invite: {
        on: {
          INVIATION_SENT: 'collection_flow',
          INVIATION_FAILURE: 'failed',
        },
      },
      collection_flow: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          COLLECTION_FLOW_FINISHED: [
            {
              target: 'run_cn_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.country == `CN`',
                },
              },
            },
            {
              target: 'run_hk_kyb',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'entity.data.country == `HK`',
                },
              },
            },
            {
              target: 'failed',
            },
          ],
        },
      },
      run_cn_kyb: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          CN_KYB_DONE: [{ target: 'run_vendor_company_sanctions' }],
          CN_KYB_FAIL: [{ target: 'failed' }],
        },
      },
      run_hk_kyb: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          HK_KYB_HOOK_RESPONDED: [{ target: 'run_vendor_company_sanctions' }],
          HK_KYB_HOOK_FAILED: [{ target: 'failed' }],
        },
      },
      run_vendor_company_sanctions: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          COMPANY_SANCTIONS_DONE: [{ target: 'run_vendor_ubos' }],
          COMPANY_SANCTIONS_FAIL: [{ target: 'failed' }],
        },
      },
      run_vendor_ubos: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          UBO_HOOK_RESPONDED: [{ target: 'run_ubos' }],
          UBO_HOOK_FAILED: [{ target: 'failed' }],
        },
      },
      run_ubos: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          EMAIL_SENT_TO_UBOS: [{ target: 'pending_kyc_response_to_finish' }],
          FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'failed' }],
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
          reject: 'rejected',
          revision: 'pending_resubmission',
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'pending_resubmission',
          KYC_REVISION: 'pending_kyc_response_to_finish',
        },
      },
      pending_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          EMAIL_SENT: 'revision',
          EMAIL_FAILURE: 'failed',
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
          COLLECTION_FLOW_FINISHED: [
            {
              target: 'manual_review',
              cond: {
                type: 'jmespath',
                options: {
                  rule: `length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.*.[?state == 'revision']) == \`0\``,
                },
              },
            },
            { target: 'pending_kyc_response_to_finish' },
          ],
        },
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'collection_invite_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        successAction: 'INVIATION_SENT',
        errorAction: 'INVIATION_FAILURE',
        method: 'POST',
        stateNames: ['collection_invite'],
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              companyName: entity.data.companyName,
              customerName: metadata.customerName,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              collectionFlowUrl: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token]),
              from: 'no-reply@ballerine.com',
              receivers: [entity.data.additionalInfo.mainRepresentative.email],
              templateId: 'd-8949519316074e03909042cfc5eb4f02',
              adapter: '{secret.MAIL_ADAPTER}'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        },
      },
      {
        name: 'cn_kyb',
        pluginKind: 'kyb',
        url: `{secret.UNIFIED_API_URL}/companies-v2`,
        method: 'GET',
        stateNames: ['run_cn_kyb'],
        successAction: 'CN_KYB_DONE',
        errorAction: 'CN_KYB_FAIL',
        persistResponseDestination: 'pluginsOutput.businessInformation.data',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                companyNumber: entity.data.registrationNumber,
                countryOfIncorporation: 'CN',
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
        name: 'hk_kyb',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies-v2/HK/{entity.data.registrationNumber}`,
        method: 'GET',
        stateNames: ['run_hk_kyb'],
        successAction: 'HK_KYB_HOOK_RESPONDED',
        errorAction: 'HK_KYB_HOOK_FAILED',
        persistResponseDestination: 'pluginsOutput.businessInformation.request',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                countryOfIncorporation: 'HK',
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/HK_KYB_HOOK_RESPONDED','?resultDestination=pluginsOutput.businessInformation.data&processName=kyb-unified-api'])
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{request: @}', // jmespath
            },
          ],
        },
      },
      {
        name: 'company_sanctions',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.companyName}/sanctions`,
        method: 'GET',
        stateNames: ['run_vendor_company_sanctions'],
        successAction: 'COMPANY_SANCTIONS_DONE',
        errorAction: 'COMPANY_SANCTIONS_FAIL',
        persistResponseDestination: 'pluginsOutput.companySanctions',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
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
        name: 'ubo',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.registrationNumber}/ubo`,
        method: 'GET',
        stateNames: ['run_vendor_ubos'],
        successAction: 'UBO_HOOK_RESPONDED',
        errorAction: 'UBO_HOOK_FAILED',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/UBO_HOOK_RESPONDED','?resultDestination=pluginsOutput.ubo.data&processName=ubo-unified-api'])
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{request: @}', // jmespath
            },
          ],
        },
      },
      {
        name: 'resubmission_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        successAction: 'EMAIL_SENT',
        errorAction: 'EMAIL_FAILURE',
        stateNames: ['pending_resubmission'],
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              // #TODO: create new token (new using old one)
              mapping: `{
              kybCompanyName: entity.data.companyName,
              customerCompanyName: metadata.customerName,
              firstName: entity.data.additionalInfo.mainRepresentative.firstName,
              resubmissionLink: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token]),
              supportEmail: join('',['support@',metadata.customerName,'.com']),
              from: 'no-reply@ballerine.com',
              name: join(' ',[metadata.customerName,'Team']),
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
            mapping: `{entity: {data: @, type: 'individual'}}`,
          },
        ],
        initEvent: 'start',
      },
    ],
    commonPlugins: [
      {
        pluginKind: 'iterative',
        name: 'ubos_iterative',
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
    initialEvent: 'START',
    createCollectionFlowToken: true,
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
      {
        definitionId: kycEmailSessionDefinition.name,
        persistenceStates: ['revision_email_sent'],
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
    projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await generateDynamicUiTest(prismaClient, workflow.id, projectId || workflow.projectId);

  return workflow;
};
