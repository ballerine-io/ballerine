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
          TIMEOUT: [{ target: 'manual_review' }],
        },
        after: {
          // 24 hours — if we haven't received a callback by then, escalate to manual review.
          86400000: [{ target: 'manual_review' }],
        },
      },
      facial_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          FACIAL_VERIFIED: [{ target: 'address_verification' }],
          FACIAL_VERIFICATION_FAILED: [{ target: 'manual_review' }],
          TIMEOUT: [{ target: 'manual_review' }],
        },
        after: {
          // 24 hours — if we haven't received a callback by then, escalate to manual review.
          86400000: [{ target: 'manual_review' }],
        },
      },
      address_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          ADDRESS_VERIFIED: [{ target: 'ncra_check' }],
          ADDRESS_VERIFICATION_FAILED: [{ target: 'manual_review' }],
          TIMEOUT: [{ target: 'manual_review' }],
        },
        after: {
          // 24 hours — if we haven't received a callback by then, escalate to manual review.
          86400000: [{ target: 'manual_review' }],
        },
      },
      ncra_check: {
        tags: [StateTag.PENDING_PROCESS],
        // Stub: auto-transition until NCRA API is available
        always: [
          {
            target: 'device_check',
          },
        ],
      },
      device_check: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          DEVICE_CHECK_COMPLETED: [{ target: 'risk_evaluation' }],
          // Graceful skip: if no device data or service error, proceed to risk evaluation.
          DEVICE_CHECK_FAILED: [{ target: 'risk_evaluation' }],
        },
        after: {
          // 30 seconds — device check is synchronous, so timeout quickly.
          30000: [{ target: 'risk_evaluation' }],
        },
      },
      risk_evaluation: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: `pluginsOutput.document_verification.verificationStatus == 'VERIFIED' && pluginsOutput.facial_verification.verificationStatus == 'VERIFIED' && pluginsOutput.address_verification.verificationStatus == 'VERIFIED' && (pluginsOutput.document_verification.confidenceScore || \`0\`) >= \`80\` && (pluginsOutput.facial_verification.confidenceScore || \`0\`) >= \`70\` && (pluginsOutput.address_verification.confidenceScore || \`0\`) >= \`60\``,
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
        timeout: 120000, // 2 minutes
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
        timeout: 120000, // 2 minutes
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
      {
        name: 'address_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyc`,
        method: 'POST',
        stateNames: ['address_verification'],
        successAction: 'ADDRESS_VERIFIED',
        errorAction: 'ADDRESS_VERIFICATION_FAILED',
        timeout: 120000, // 2 minutes
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
              mapping: `{
                person: {
                  id: entity.id,
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  address: entity.data.address,
                  documents: documents[?category=='proof_of_address' || category=='proof_of_location'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['ADDRESS_VERIFICATION'],
                countryCode: 'SL',
                callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.address_verification.data&processName=address-verification-unified-api'])
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "merge(@, { name: 'address_verification', verificationStatus: status, status: status == 'PENDING' && 'IN_PROGRESS' || status == 'ERROR' && 'ERROR' || status == 'EXPIRED' && 'ERROR' || 'SUCCESS' })",
            },
          ],
        },
      },
      {
        name: 'device_dedup_check',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/entity-resolution/devices/check-duplicate`,
        method: 'POST',
        stateNames: ['device_check'],
        successAction: 'DEVICE_CHECK_COMPLETED',
        errorAction: 'DEVICE_CHECK_FAILED',
        timeout: 15000, // 15 seconds — synchronous call
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
              mapping: `{
                device: {
                  fingerprintJsDeviceId: entity.data.fingerprintJsDeviceId,
                  fingerprintJsDeviceHash: entity.data.fingerprintJsDeviceHash,
                  deviceFingerprint: entity.data.deviceFingerprint,
                  deviceFirebaseInstallationId: entity.data.deviceFirebaseInstallationId,
                  deviceLocalInstallationId: entity.data.deviceLocalInstallationId,
                  deviceImei: entity.data.deviceImei,
                  deviceModel: entity.data.deviceModel,
                  deviceBrand: entity.data.deviceBrand,
                  deviceUserAgent: entity.data.deviceUserAgent,
                  deviceIp: entity.data.deviceIp
                },
                countryCode: 'SL'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: "merge(@, { name: 'device_dedup_check', status: 'SUCCESS' })",
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
    workflowLevelResolution: true,
    isCaseOverviewEnabled: true,
    isDocumentTrackerEnabled: true,
    isInitiateKycEnabled: false,
    isKycEndUserEditEnabled: true,
    isAgentEditingEnabled: true,
    editableContext: {
      entityInfo: true,
    },
    theme: { type: 'kyc' },
    // Address verification: wired end-to-end via address_verification state +
    // ADDRESS_VERIFICATION method in the Unified API.
    addressVerificationEnabled: true,
    // SDK step sequence for the KYC mobile page (index.html).
    // The frontend reads this from workflowData.config.kycSdkSteps to drive
    // the Ballerine Web UI SDK flow.  If absent, the page falls back to its
    // own hardcoded buildSteps() list.
    // NOTE: These are Ballerine Web UI SDK step names — NOT to be confused with
    // the collection-flow form-page names (personal_information, kyc_documents, etc.)
    // which live in collectionFlow.state.steps.
    kycSdkSteps: [
      'welcome',
      'document-selection',
      'document-photo',
      'check-document',
      'document-photo-back-start',
      'document-photo-back',
      'check-document-photo-back',
      'selfie-start',
      'selfie',
      'check-selfie',
      // Address proof — captured as proof_of_address / utility_bill category
      'address-proof-start',
      'address-proof-photo',
      'check-address-proof',
      'loading',
      'resubmission',
      'decline',
      'manual-review',
      'error',
      'final',
    ],
    // Optional mobile-web UX behavior toggles used by kyc-mobile pages.
    kycSdkUi: {
      enableLargeTypography: true,
      simplifyCopy: true,
      hideWebHeaderInNative: true,
      skipWelcomeWhenNativeIntro: true,
      showCompatTriggerReason: true,
      requireAddressProof: true,
      forceLegacyWhenAddressProof: false, // SDK now handles address proof natively
    },
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
            // Device fingerprint fields (forwarded from mobile app / loan workflow)
            fingerprintJsDeviceId: Type.Optional(Type.String()),
            fingerprintJsDeviceHash: Type.Optional(Type.String()),
            deviceFingerprint: Type.Optional(Type.String()),
            deviceFirebaseInstallationId: Type.Optional(Type.String()),
            deviceLocalInstallationId: Type.Optional(Type.String()),
            deviceImei: Type.Optional(Type.String()),
            deviceModel: Type.Optional(Type.String()),
            deviceBrand: Type.Optional(Type.String()),
            deviceUserAgent: Type.Optional(Type.String()),
            deviceIp: Type.Optional(Type.String()),
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
