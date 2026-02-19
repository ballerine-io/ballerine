import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { generateBaseCaseLevelStatesWithPendingResubmission } from '../generate-base-case-level-states';

export const kycOnboardingSierraLeoneDefinition = {
  id: 'kyc_onboarding_sierra_leone',
  name: 'kyc_onboarding_sierra_leone',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyc_onboarding_sierra_leone_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          start: 'document_collection',
          // Programmatic start (e.g., LoanCube/NAMK) when documents are already present in context.
          start_with_documents: 'document_verification',
        },
      },
      document_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          // Ballerine collection-flow app sends this on final submission.
          COLLECTION_FLOW_FINISHED: 'document_verification',
          // Legacy alias (kept for backwards compatibility with any custom clients).
          COLLECTION_COMPLETED: 'document_verification',
        },
      },
      document_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          DOCUMENT_VERIFIED: [{ target: 'facial_verification' }],
          DOCUMENT_VERIFICATION_FAILED: [{ target: 'manual_review' }],
        },
      },
      facial_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          FACIAL_VERIFIED: [{ target: 'ncra_check' }],
          FACIAL_VERIFICATION_FAILED: [{ target: 'manual_review' }],
        },
      },
      ncra_check: {
        tags: [StateTag.PENDING_PROCESS],
        // Stub: auto-transition until NCRA API is available
        always: [
          {
            target: 'risk_evaluation',
          },
        ],
      },
      risk_evaluation: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: `pluginsOutput.document_verification.verificationStatus == 'VERIFIED' && pluginsOutput.facial_verification.verificationStatus == 'VERIFIED' && (pluginsOutput.document_verification.confidenceScore || \`0\`) >= \`80\` && (pluginsOutput.facial_verification.confidenceScore || \`0\`) >= \`70\``,
              },
            },
          },
          {
            target: 'manual_review',
          },
        ],
      },
      ...generateBaseCaseLevelStatesWithPendingResubmission({
        resumeState: 'document_verification',
      }),
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'document_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyc`,
        method: 'POST',
        stateNames: ['document_verification'],
        successAction: 'DOCUMENT_VERIFIED',
        errorAction: 'DOCUMENT_VERIFICATION_FAILED',
        headers: {
          Authorization: `Bearer {secret.UNIFIED_API_TOKEN}`,
          'x-api-key': '{secret.UNIFIED_API_TOKEN}',
          'Content-Type': 'application/json',
          'x-tenant-id': '{entity.data.tenantId}',
          'x-project-id': '{entity.data.projectId}',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              // Some clients (e.g., NAMK) may not have `nationalId` on file.
              // Coalesce from entity, then from collected identity document properties.
              mapping: `{
	                person: {
                  id: entity.id,
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  idNumber: entity.data.nationalId || entity.data.passportNumber,
                  idType: 'NATIONAL_ID',
                  dateOfBirth: entity.data.dateOfBirth,
                  phoneNumber: entity.data.phoneNumber,
                  documents: documents[?category=='proof_of_identity'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    backImageUrl: pages[1].uri,
                    issuingCountry: 'SL',
                    number: properties.nationalIdNumber || properties.documentNumber
                  }
	                },
	                methods: ['DOCUMENT_VERIFICATION'],
	                countryCode: 'SL',
                  callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.document_verification.data&processName=document-verification-unified-api'])
	              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "merge(@, { name: 'document_verification', verificationStatus: status, status: status == 'PENDING' && 'IN_PROGRESS' || status == 'ERROR' && 'ERROR' || status == 'EXPIRED' && 'ERROR' || 'SUCCESS' })",
            },
          ],
        },
      },
      {
        name: 'facial_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyc`,
        method: 'POST',
        stateNames: ['facial_verification'],
        successAction: 'FACIAL_VERIFIED',
        errorAction: 'FACIAL_VERIFICATION_FAILED',
        headers: {
          Authorization: `Bearer {secret.UNIFIED_API_TOKEN}`,
          'x-api-key': '{secret.UNIFIED_API_TOKEN}',
          'Content-Type': 'application/json',
          'x-tenant-id': '{entity.data.tenantId}',
          'x-project-id': '{entity.data.projectId}',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              // Some clients (e.g., NAMK) may not have `nationalId` on file.
              // Coalesce from entity, then from collected identity document properties.
              mapping: `{
	                person: {
                  id: entity.id,
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  idNumber: entity.data.nationalId || entity.data.passportNumber,
                  dateOfBirth: entity.data.dateOfBirth,
                  documents: documents[?category=='proof_of_identity'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  },
                  biometricData: {
                    facialImages: documents[?category=='proof_of_identity_ownership'].pages[].uri
                  }
	                },
	                methods: ['FACIAL_RECOGNITION'],
	                countryCode: 'SL',
                  callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.facial_verification.data&processName=facial-verification-unified-api'])
	              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "merge(@, { name: 'facial_verification', verificationStatus: status, status: status == 'PENDING' && 'IN_PROGRESS' || status == 'ERROR' && 'ERROR' || status == 'EXPIRED' && 'ERROR' || 'SUCCESS' })",
            },
          ],
        },
      },
    ],
    childWorkflowPlugins: [],
    commonPlugins: [],
  },
  config: {
    createCollectionFlowToken: true,
  },
  contextSchema: {
    type: 'json-schema',
    schema: Type.Composite([
      defaultContextSchema,
      Type.Object({
        entity: Type.Object({
          type: Type.Literal('individual'),
          id: Type.String(),
          data: Type.Object({
            firstName: Type.String(),
            lastName: Type.String(),
            nationalId: Type.Optional(Type.String()),
            passportNumber: Type.Optional(Type.String()),
            dateOfBirth: Type.Optional(Type.String()),
            phoneNumber: Type.Optional(Type.String()),
            email: Type.Optional(Type.String()),
            gender: Type.Optional(Type.String()),
            country: Type.Optional(Type.String({ default: 'SL' })),
            address: Type.Optional(
              Type.Object({
                line1: Type.Optional(Type.String()),
                line2: Type.Optional(Type.String()),
                city: Type.Optional(Type.String()),
                district: Type.Optional(Type.String()),
                country: Type.Optional(Type.String({ default: 'SL' })),
              }),
            ),
            tenantId: Type.Optional(Type.String()),
            projectId: Type.Optional(Type.String()),
          }),
        }),
      }),
    ]),
  },
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};

export const generateKycOnboardingSierraLeone = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = kycOnboardingSierraLeoneDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
