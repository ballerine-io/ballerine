import { PrismaClient } from '@prisma/client';
import { StateTag } from '@ballerine/common';
import { PrismaTransactionClient } from '@/types';

export const generateKycDefinition = (customerName?: string) => ({
  id: customerName ? `kyc_definition_${customerName.toLowerCase()}` : 'kyc_definition',
  name: 'kyc_definition',
  version: 1,
  definitionType: 'statechart-json',
  crossEnvKey: 'kyc_definition',
  definition: {
    id: 'kyc_definition',
    predictableActionArguments: true,
    initial: 'idle',
    states: {
      idle: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          start: 'get_kyc_session',
          initiate_sanctions_screening: 'initiated_sanctions_screening',
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
          KYC_RESPONSE_RECEIVED: [{ target: 'manual_review' }],
        },
      },
      revision_email_sent: {
        tags: [StateTag.REVISION],
        on: {
          KYC_RESPONSE_RECEIVED: [{ target: 'manual_review' }],
        },
      },
      manual_review: {
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
          initiate_sanctions_screening: 'initiated_sanctions_screening',
          VENDOR_DONE: {
            actions: 'NO_OP',
          },
        },
      },
      initiated_sanctions_screening: {
        tags: [StateTag.DATA_ENRICHMENT],
        on: {
          VENDOR_DONE: [{ target: 'manual_review' }],
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
      {
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        displayName: 'Sanctions Screening',
        stateNames: ['initiated_sanctions_screening'],
        errorAction: 'VENDOR_DONE',
        successAction: 'VENDOR_DONE',
        payload: {
          clientId: {
            __type: 'path',
            value: 'metadata.customerName',
          },
          vendor: 'veriff',
          ongoingMonitoring: false,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'entity.data',
          },
        },
      },
    ],
  },
  config: {
    callbackResult: {
      transformers: [
        {
          transformer: 'jmespath',
          mapping: '{data: @}',
        },
      ],
      deliverEvent: 'KYC_DONE',
    },
  },
});

export const createKycDefinition = async (
  prismaClient: PrismaTransactionClient | PrismaClient,
  projectId?: string,
  customerName?: string,
) => {
  return await prismaClient.workflowDefinition.create({
    data: {
      ...generateKycDefinition(customerName),
      isPublic: true,
    },
  });
};
