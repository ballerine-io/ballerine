import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';

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
        on: {
          SEND_EMAIL: [{ target: 'email_sent' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      email_sent: {
        on: {
          KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      kyc_manual_review: {
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
        always: [
          {
            target: 'get_kyc_session',
          },
        ],
      },
      kyc_auto_reject: {
        type: 'final' as const,
      },
      rejected: {
        type: 'final' as const,
      },
      approved: {
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'kyc_session',
        pluginKind: 'kyc-session',
        url: `{secret.KYC_API_URL}/individual-verification-sessions`,
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
              endUserId: entity.id,
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
              receivers: [entity.data.email],
              subject: '{customerCompanyName} activation, Action needed.',
              preheader: 'Verify your identity for Happy Home Goods activation with {customerCompanyName}.',
              templateId: (documents[].decision[].revisionReason | [0])!=null && 'd-7305991b3e5840f9a14feec767ea7301' || 'd-2c6ae291d9df4f4a8770d6a4e272d803',
              revisionReason: documents[].decision[].revisionReason | [0],
              supportEmail: join('',['PayLynk','@support.com']),
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
};
export const generateKycSessionDefinition = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycEmailSessionDefinition,
  });
};
