import { PrismaClient } from '@prisma/client';

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
          PENDING_KYC: [{ target: 'manual_review' }],
          API_CALL_ERROR: [{ target: 'auto_reject' }],
        },
      },
      manual_review: {
        type: 'final' as const,
      },
      auto_approve: {
        type: 'final' as const,
      },
      auto_reject: {
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
        pluginType: 'kyc',
        url: `{secret.KYC_API_URL}/individual-verifications`,
        method: 'POST',
        stateNames: ['run_kyc'],
        successAction: 'PENDING_KYC',
        errorAction: 'API_CALL_ERROR',
        headers: { Authorization: 'Bearer {secret.KYC_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              endUserId: entity.id,
              callbackUrl: join('',['http://localhost:3000/internal/',entity.id,'/hook/kyc_result']),
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
};
export const generateKycForE2eTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kycDynamicExample,
  });
};
