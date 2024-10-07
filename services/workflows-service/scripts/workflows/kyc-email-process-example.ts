import { PrismaClient } from '@prisma/client';
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
      },
      {
        name: 'session',
        pluginKind: 'template-email',
        template: 'session',
        stateNames: ['email_sent', 'revision_email_sent'],
        errorAction: 'EMAIL_FAILURE',
        successAction: 'EMAIL_SENT',
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
