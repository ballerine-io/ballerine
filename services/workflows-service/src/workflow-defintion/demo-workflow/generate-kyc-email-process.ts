import { PrismaClient } from '@prisma/client';
import { StateTag } from '@ballerine/common';
import { PrismaTransactionClient } from '@/types';

export const kycEmailSessionDefinition = (customerName?: string) => ({
  id: customerName
    ? `kyc_email_session_example_${customerName.toLowerCase()}`
    : 'kyc_email_session_example',
  name: 'kyc_email_session_example',
  version: 1,
  definitionType: 'statechart-json',
  crossEnvKey: 'kyc_email_session_example',
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
          KYC_RESPONSE_RECEIVED: [{ target: 'kyc_manual_review' }],
        },
      },
      revision_email_sent: {
        tags: [StateTag.REVISION],
        on: {
          KYC_RESPONSE_RECEIVED: [{ target: 'kyc_manual_review' }],
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
        vendor: 'veriff',
        stateNames: ['get_kyc_session', 'get_kyc_session_revision'],
        successAction: 'SEND_EMAIL',
        errorAction: 'API_CALL_ERROR',
        withAml: true,
      },
      {
        name: 'session',
        pluginKind: 'template-email',
        template: 'session',
        stateNames: ['email_sent', 'revision_email_sent'],
        errorAction: 'API_CALL_ERROR',
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
});

export const generateKycSessionDefinition = async (
  prismaClient: PrismaTransactionClient | PrismaClient,
  projectId?: string,
  customerName?: string,
) => {
  return await prismaClient.workflowDefinition.create({
    data: {
      ...kycEmailSessionDefinition(customerName),
      isPublic: true,
    },
  });
};
