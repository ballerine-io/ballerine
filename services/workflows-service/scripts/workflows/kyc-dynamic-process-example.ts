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
          PENDING_KYC: [],
          API_CALL_ERROR: [
            {
              target: 'auto_reject',
            },
          ],
        },
      },
      kyc_result: {
        on: {
          target: 'manual_review',
        },
      },
      manual_review: {
        on: {
          approve: 'approve',
          reject: 'reject',
        },
      },
      auto_approve: {
        type: 'final' as 'final',
      },
      auto_reject: {
        type: 'final' as 'final',
      },
      reject: {
        type: 'final' as 'final',
      },
      approve: {
        type: 'final' as 'final',
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
        request: {
          transform: {
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
        },
        response: {
          transform: {
            transformer: 'jmespath',
            mapping: '@', // jmespath
          },
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
