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
          COLLECTION_FLOW_FINISHED: 'run_ubos',
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
      auto_reject: {
        tags: [StateTag.REJECTED],
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
    isPublic: projectId ? false : true,
    projectId: projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await generateDynamicUiTest(prismaClient, workflow.id, projectId || workflow.projectId);

  return workflow;
};
