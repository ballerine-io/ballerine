import { PrismaClient } from '@prisma/client';

export const kycDynamicExample = {
  id: 'kyc_session_example',
  name: 'kyc_session_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_session_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          start: 'kyc_session',
        },
      },
      kyc_session: {
        on: {
          KYC_FINISHED: [{ target: 'kyc_manual_review' }],
          SEND_EMAIL: [{ target: 'send_email' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      send_email: {
        on: {
          EMAIL_SENT: [{ target: 'kyc_session' }],
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
        name: 'request_kyc',
        pluginKind: 'kyc',
        url: `{secret.KYC_API_URL}/individual-verification-sessions`,
        method: 'POST',
        stateNames: ['run_kyc_session'],
        successAction: 'SEND_EMAIL',
        errorAction: 'API_CALL_ERROR',
        headers: { Authorization: 'Bearer {secret.KYC_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
               firstName: entity.data.firstName,
               lastName: entity.data.lastName,
               vendor: 'veriff'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{sessionUrl: url, sessionId: id}', // jmespath
            },
          ],
        },
      },
      {
        name: 'send_kyc_session_email',
        pluginKind: 'email',
        sender: '', // TODO: add sender
        to: 'entity.data.email', // jmeshpath
        method: 'POST',
        stateNames: ['send_email'],
        template: 'some_temrplate_name',
        headers: { Authorization: 'Bearer {secret.EMAIL_SECRET}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
               firstName: entity.data.firstName,
               lastName: entity.data.lastName,
               vendor: 'veriff'
              }`, // jmespath
            },
          ],
        },
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
export const generateKycForE2eTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycDynamicExample,
  });
};
