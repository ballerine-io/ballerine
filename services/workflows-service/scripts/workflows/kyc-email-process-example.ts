import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';
import { defaultContextSchema, StateTag } from '@ballerine/common';

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
      email_sent: {
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
            target: 'get_kyc_session',
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
        url: `${env.UNIFIED_API_URL}/individual-verification-sessions`,
        method: 'POST',
        stateNames: ['get_kyc_session'],
        successAction: 'SEND_EMAIL',
        errorAction: 'API_CALL_ERROR',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              endUserId: join('__',[entity.id,pluginsOutput.kyc_session.kyc_session_1.result.metadata.id || '']),
              firstName: entity.data.firstName,
              lastName: entity.data.lastName,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/KYC_HOOK_RESPONDED', '?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result']),
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
        stateNames: ['email_sent'],
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
              preheader: 'Verify your identity for Happy Home Goods activation with {customerCompanyName}.',
              templateId: (documents[].decision[].revisionReason | [0])!=null && 'd-7305991b3e5840f9a14feec767ea7301' || 'd-61c568cfa5b145b5916ff89790fe2065',
              revisionReason: documents[].decision[].revisionReason | [0],
              supportEmail: join('',[entity.data.additionalInfo.companyName,'@support.com'])
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
  contextSchema: {
    type: 'json-schema',
    schema: defaultContextSchema,
  },
};

export const generateKycSessionDefinition = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycEmailSessionDefinition,
  });
};
