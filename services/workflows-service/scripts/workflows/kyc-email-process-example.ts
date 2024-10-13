import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';
import { StateTag, WorkflowDefinitionVariant } from '@ballerine/common';

export const kycEmailSessionDefinition = {
  id: 'kyc_email_session_example',
  name: 'kyc_email_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_email_session_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    states: {
      idle: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          start: 'get_kyc_session',
        },
      },
      get_kyc_session: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          SEND_EMAIL: [{ target: 'email_sent' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      get_kyc_session_revision: {
        tags: [StateTag.REVISION],
        on: {
          SEND_EMAIL: [{ target: 'revision_email_sent' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      email_sent: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      revision_email_sent: {
        tags: [StateTag.REVISION],
        on: {
          KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      kyc_manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: {
            target: 'approved',
          },
          reject: {
            target: 'rejected',
          },
          revision: {
            target: 'revision',
          },
        },
      },
      revision: {
        tags: [StateTag.REVISION],
        always: [
          {
            target: 'get_kyc_session_revision',
          },
        ],
      },
      kyc_auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'kyc_session',
        pluginKind: 'kyc-session',
        url: `{secret.UNIFIED_API_URL}/individual-verification-sessions`,
        method: 'POST',
        stateNames: ['get_kyc_session', 'get_kyc_session_revision'],
        successAction: 'SEND_EMAIL',
        errorAction: 'API_CALL_ERROR',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              endUserId: join('__',[entity.ballerineEntityId || entity.data.id || entity.data.identityNumber, pluginsOutput.kyc_session.kyc_session_1.result.metadata.id || '']),
              firstName: entity.data.firstName,
              lastName: entity.data.lastName,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/KYC_HOOK_RESPONDED','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result']),
              vendor: 'veriff'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: "{kyc_session_1: {vendor: 'veriff', type: 'kyc', result: {metadata: @}}}", // jmespath
            },
          ],
        },
      },
      {
        name: 'session_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        stateNames: ['email_sent', 'revision_email_sent'],
        headers: {
          Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
          'Content-Type': 'application/json',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              kybCompanyName: entity.data.additionalInfo.companyName,
              customerCompanyName: entity.data.additionalInfo.customerCompany,
              firstName: entity.data.firstName,
              kycLink: pluginsOutput.kyc_session.kyc_session_1.result.metadata.url,
              from: 'no-reply@ballerine.com',
              name: join(' ',[entity.data.additionalInfo.customerCompany,'Team']),
              receivers: [entity.data.email],
              subject: '{customerCompanyName} activation, Action needed.',
              templateId: (documents[].decision[].revisionReason | [0])!=null && 'd-2c6ae291d9df4f4a8770d6a4e272d803' || 'd-61c568cfa5b145b5916ff89790fe2065',
              revisionReason: documents[].decision[].revisionReason | [0],
              language: workflowRuntimeConfig.language,
              supportEmail: join('',['support@',entity.data.additionalInfo.customerCompany,'.com']),
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
  },
  config: {
    callbackResult: {
      transformers: [
        {
          transformer: 'jmespath',
          mapping: '{data: @}', // jmespath
        },
      ],
      deliverEvent: 'KYC_DONE',
    },
  },
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};

export const generateKycSessionDefinition = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycEmailSessionDefinition,
  });
};
