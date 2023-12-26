import { PrismaClient } from '@prisma/client';
import { env } from '../../src/env';
import { StateTag, WorkflowDefinitionVariant } from '@ballerine/common';

export const kycDynamicExample = {
  id: 'dynamic_kyc_example',
  name: 'dynamic_kyc_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          start: 'run_kyc',
        },
      },
      run_kyc: {
        on: {
          PENDING_KYC: [{ target: 'pending_kyc_response' }],
          API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
        },
      },
      pending_kyc_response: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_RESPONDED: [{ target: 'kyc_manual_review' }],
        },
      },
      kyc_manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        type: 'final' as const,
      },
      kyc_auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      approve: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'request_kyc',
        pluginKind: 'kyc',
        url: `${env.UNIFIED_API_URL}/individual-verifications`,
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
              endUserId: entity.id,
              callbackUrl: join('',['http://localhost:3000/api/v1/internal/workflows/',workflowRuntimeId,'/hook/KYC_RESPONDED?&projectId=',projectId]),
              person: {
               firstName: entity.data.firstName,
               lastName: entity.data.lastName,
               idNumber: entity.data.additionalInfo.idNumber,
               gender: entity.data.additionalInfo.gender,
               dateOfBirth: entity.data.dateOfBirth
               },
              document: {
                number: documents[0].properties.docNumber,
                country: documents[0].issuer.country,
                type: 'PASSPORT'
                },
              images: {
                face: documents[0].pages[?contains(metadata.side, 'face')].uri | [0],
                documentFront: documents[0].pages[?contains(metadata.side, 'front')].uri | [0],
                documentBack: documents[0].pages[?contains(metadata.side, 'back')].uri | [0]
                },
              address: {
                fullAddress: entity.data.additionalInfo.address
                },
              vendor: 'veriff'
              }`, // jmespath
            },
            {
              transformer: 'helper',
              mapping: [
                {
                  source: 'person.dateOfBirth',
                  target: 'person.dateOfBirth',
                  method: 'regex',
                  value: '\\d{4}-\\d{2}-\\d{2}',
                },
                {
                  source: 'images.face',
                  target: 'images.face',
                  method: 'imageUrlToBase64',
                },
                {
                  source: 'images.documentFront',
                  target: 'images.documentFront',
                  method: 'imageUrlToBase64',
                },
                {
                  source: 'images.documentBack',
                  target: 'images.documentBack',
                  method: 'imageUrlToBase64',
                },
              ],
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
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};
export const generateKycForE2eTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycDynamicExample,
  });
};
