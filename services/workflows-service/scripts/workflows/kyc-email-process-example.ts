import { PrismaClient } from '@prisma/client';

export const kycDynamicExample = {
  id: 'kyc_email_session_example',
  name: 'kyc_email_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_email_session_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          start: 'get_kyc_session',
        },
      },
      get_kyc_session: {
        on: {
          PENDING_KYC: [{ target: 'send_email' }],
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
        url: `{secret.KYC_API_URL}/individual-verifications`,
        method: 'POST',
        stateNames: ['run_kyc'],
        successAction: 'PENDING_KYC',
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
export const generateKycForE2eTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycDynamicExample,
  });
};
