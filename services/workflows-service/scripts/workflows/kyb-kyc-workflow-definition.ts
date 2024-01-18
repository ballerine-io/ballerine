import { PrismaClient } from '@prisma/client';
import { kycEmailSessionDefinition } from './kyc-email-process-example';
import { env } from '../../src/env';

import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';

export const kybKycWorkflowDefinition = {
  id: 'kyb_kyc',
  name: 'kyb_kyc',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_kyc',
    predictableActionArguments: true,
    initial: 'pending_invitation_email',
    context: {
      documents: [],
    },
    states: {
      pending_invitation_email: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          INVITATION_EMAIL_SENT: 'data_collection',
          INVITATION_EMAIL_FAILED: 'auto_reject',
        },
      },
      data_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          start: 'run_ubos',
        },
      },
      run_ubos: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          CONTINUE: [{ target: 'run_kyb_enrichment' }],
          FAILED: [{ target: 'auto_reject' }],
        },
      },
      run_kyb_enrichment: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          KYB_DONE: [{ target: 'pending_kyc_response_to_finish' }],
          // TODO: add 404 handling
          FAILED: [{ target: 'auto_reject' }],
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
        always: [
          {
            target: 'manual_review',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.additionalInfo.ubos == null || length(entity.data.additionalInfo.ubos) == `0`',
              },
            },
          },
        ],
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'revision',
        },
      },
      pending_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          RESUBMITTED: 'manual_review',
        },
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
      revision: {
        tags: [StateTag.REVISION],
        always: [
          {
            target: 'pending_resubmission',
          },
        ],
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
        name: 'invitation_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        stateNames: ['pending_invitation_email'],
        successAction: 'INVITATION_EMAIL_SENT',
        errorAction: 'INVITATION_EMAIL_FAILED',
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              templateId: 'd-00a0d5d14cb14fbb9034b53c6ef7e5fa',
              adapter: '${env.MAIL_ADAPTER}'
              from: 'no-reply@ballerine.com',
              receivers: [mainRepresentative.email],
              name: mainRepresentative.fullName,
              provider: customerName,
              url: join('',['${env.KYB_EXAMPLE_CORS_ORIGIN[0]}?token=',token])
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        },
      },
      {
        name: 'open_corporates',
        pluginKind: 'kyb',
        url: `${env.UNIFIED_API_URL}/companies`,
        method: 'GET',
        stateNames: ['run_kyb_enrichment'],
        successAction: 'KYB_DONE',
        errorAction: 'KYB_DONE',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              countryOfIncorporation: entity.data.countryOfIncorporation,
              companyNumber: entity.data.registrationNumber,
              state: entity.data.dynamicInfo.companyInformation.state
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
        name: 'ubos_iterative',
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
    createCollectionFlowToken: true,
  },
  contextSchema: {
    type: 'json-schema',
    schema: Type.Composite([
      defaultContextSchema,
      Type.Object({
        token: Type.Optional(Type.String()),
        mainRepresentative: Type.Object({
          fullName: Type.String(),
          email: Type.String(),
        }),
        customerName: Type.String(),
      }),
    ]),
  },
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};
export const generateKybKycWorkflowDefinition = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: { ...kybKycWorkflowDefinition },
  });
};
