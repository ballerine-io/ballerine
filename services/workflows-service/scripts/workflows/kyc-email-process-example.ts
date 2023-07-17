import { PrismaClient } from '@prisma/client';

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
          SEND_EMAIL: [{ target: 'send_email' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      send_email: {
        on: {
          KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      kyc_manual_review: {
        type: 'final' as const,
      },
      kyc_auto_reject: {
        type: 'final' as const,
      },
      reject: {
        type: 'final' as const,
      },
      approve: {
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
              firstName: entity.data.firstName,
              lastName: entity.data.lastName,
              callbackUrl: join('',['http://localhost:3000/api/v1/internal/workflows/',workflowRuntimeId,'/hook/KYC_HOOK_RESPONDED', '?resultDestination=vendorResult']),
              vendor: 'veriff'
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
        name: 'session_email',
        pluginKind: 'email',
        url: `{secret.EMAIL_API_URL}`,
        method: 'POST',
        stateNames: ['send_email'],
        headers: { Authorization: 'Bearer {secret.EMAIL_API_TOKEN}', 'Content-Type': 'application/json' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              kybCompanyName: entity.data.additionalInfo.companyName,
              customerCompanyName: entity.data.additionalInfo.customerCompany,
              from: 'no-reply@ballerine.com',
              receivers: [entity.data.email],
              subject: '{entity.data.additionalInfo.customerCompany} activation, Action needed.',
              preheader: 'Verify your identity for Happy Home Goods activation with {entity.data.additionalInfo.customerCompany}.',
              templateId: 'd-61c568cfa5b145b5916ff89790fe2065'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [],
        }
      }
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
