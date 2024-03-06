import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';
import { kycEmailSessionDefinition } from './kyc-email-process-example';

import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { generateDynamicUiTest } from './ui-definition/ui-kyb-parent-dynamic-example';

const KYC_DONE_RULE =
  'childWorkflows.kyc_email_session_example && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[])';

const VENDOR_DONE_RULE =
  'pluginsOutput.businessInformation.data && pluginsOutput.ubo.data && pluginsOutput.companySanctions.data';

const kycAndVendorDone = {
  target: 'manual_review',
  cond: {
    type: 'jmespath',
    options: {
      rule: `${KYC_DONE_RULE} && ${VENDOR_DONE_RULE}`,
    },
  },
};

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
          COLLECTION_FLOW_FINISHED: [{ target: 'run_ubos' }],
        },
      },
      run_ubos: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          EMAIL_SENT_TO_UBOS: [{ target: 'run_vendor_data' }],
          FAILED_EMAIL_SENT_TO_UBOS: [{ target: 'failed' }],
        },
      },
      run_vendor_data: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          KYC_RESPONDED: [kycAndVendorDone],
          VENDOR_DONE: [
            {
              target: 'pending_kyc_response_to_finish',
              cond: {
                type: 'jmespath',
                options: {
                  rule: `!(${KYC_DONE_RULE}) && ${VENDOR_DONE_RULE}`,
                },
              },
            },
            kycAndVendorDone,
          ],
          VENDOR_FAILED: 'failed',
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
                  rule: KYC_DONE_RULE,
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
                  rule: `${KYC_DONE_RULE} && length(childWorkflows.kyc_email_session_example.*.[?state == 'revision']) == \`0\``,
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
                customerName: metadata.customerName,
                collectionFlowUrl: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
                from: 'no-reply@ballerine.com',
                receivers: [entity.data.additionalInfo.mainRepresentative.email],
                language: workflowRuntimeConfig.language,
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
        name: 'kyb',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies-v2/{entity.data.country}/{entity.data.registrationNumber}`,
        method: 'GET',
        stateNames: ['run_vendor_data'],
        successAction: 'VENDOR_DONE',
        errorAction: 'VENDOR_FAILED',
        persistResponseDestination: 'pluginsOutput.businessInformation',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `merge(
                { vendor: 'asia-verify' },
                entity.data.country == 'HK' && {
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.businessInformation.data&processName=kyb-unified-api'])
                }
              )`, // jmespath
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
        name: 'company_sanctions',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.companyName}/sanctions`,
        method: 'GET',
        stateNames: ['run_vendor_data'],
        successAction: 'VENDOR_DONE',
        errorAction: 'VENDOR_FAILED',
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
        stateNames: ['run_vendor_data'],
        successAction: 'VENDOR_DONE',
        errorAction: 'VENDOR_FAILED',
        persistResponseDestination: 'pluginsOutput.ubo.request',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.ubo.data&processName=ubo-unified-api'])
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
                resubmissionLink: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
                supportEmail: join('',['support@',metadata.customerName,'.com']),
                from: 'no-reply@ballerine.com',
                name: join(' ',[metadata.customerName,'Team']),
                receivers: [entity.data.additionalInfo.mainRepresentative.email],
                templateId: 'd-7305991b3e5840f9a14feec767ea7301',
                revisionReason: documents[].decision[].revisionReason | [0],
                language: workflowRuntimeConfig.language,
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
        initEvent: 'start',
      },
    ],
    commonPlugins: [
      {
        pluginKind: 'iterative',
        name: 'ubos_iterative',
        actionPluginName: 'veriff_kyc_child_plugin',
        stateNames: ['run_ubos'],
        iterateOn: [{ transformer: 'jmespath', mapping: 'entity.data.additionalInfo.ubos' }],
        successAction: 'EMAIL_SENT_TO_UBOS',
        errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
      },
    ],
  },
  config: {
    language: 'en',
    supportedLanguages: ['en', 'cn'],
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
    workflowLevelResolution: true,
  },
  contextSchema: {
    type: 'json-schema',
    schema: defaultContextSchema,
  },
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};

export const generateDynamicUiWorkflow = async (prismaClient: PrismaClient, projectId: string) => {
  const kybDynamicExample = {
    ...dynamicUiWorkflowDefinition,
    isPublic: !projectId,
    projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await generateDynamicUiTest(
    prismaClient,
    workflow.id,
    // @ts-ignore - is null expected?
    projectId || workflow.projectId,
  );

  return workflow;
};
