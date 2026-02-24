import { PrismaClient } from '@prisma/client';
import {
  defaultContextSchema,
  getDocumentsByCountry,
  StateTag,
  WorkflowDefinitionVariant,
} from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { kycOnboardingSierraLeoneDefinition } from './kyc-onboarding-sierra-leone';
import { generateBaseCaseLevelStatesWithPendingResubmission } from '../generate-base-case-level-states';

/**
 * Informal / Sole Proprietorship KYB workflow for Sierra Leone.
 *
 * Designed for market traders, petty traders, and informal businesses
 * that may not have formal registration documents. This is the majority
 * of MiKashBoks users.
 *
 * Key differences from formal KYB:
 * - Single owner (sole proprietor), not iterative director/UBO verification
 * - No business registry check (informal businesses are not registered)
 * - Market Association Card replaces Certificate of Incorporation
 * - Community Leader Letter is the primary address proof
 * - Lower auto-approval confidence threshold (70 vs 80 for formal)
 * - Business photo classification step to analyze business premises
 *
 * Steps:
 * 1. Data collection (owner info, business photos, market card, address proof)
 * 2. Owner KYC — Spawns child kyc_onboarding_sierra_leone for sole proprietor
 * 3. Business photo classification — AI analyzes photos of the business
 *    (stock levels, equipment, business type confirmation) via Document API
 * 4. Market card verification — Non-blocking (proceeds even if failed/missing)
 * 5. Address verification (community leader letter, utility bill)
 * 6. Risk evaluation (aggregates all results)
 */
export const kybOnboardingSierraLeoneInformalDefinition = {
  id: 'kyb_onboarding_sierra_leone_informal',
  name: 'kyb_onboarding_sierra_leone_informal',
  version: 1,
  definitionType: 'statechart-json',
  // SL document schemas for informal KYB-relevant categories.
  // Includes identity docs (for owner KYC child), market cards,
  // location proofs, and financial documents for informal traders.
  documentsSchema: getDocumentsByCountry('SL').filter(doc =>
    [
      'proof_of_identity',
      'proof_of_identity_ownership',
      'business_document',
      'proof_of_location',
      'proof_of_address',
      'financial_information',
    ].includes(doc.category),
  ),
  definition: {
    id: 'kyb_onboarding_sierra_leone_informal_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          start: 'data_collection',
          // Programmatic start (e.g., LoanCube) when documents are already present in context.
          start_with_documents: 'owner_id_check',
        },
      },
      data_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          // Ballerine collection-flow app sends this on final submission.
          COLLECTION_FLOW_FINISHED: 'owner_id_check',
          // Legacy alias (kept for backwards compatibility with any custom clients).
          COLLECTION_COMPLETED: 'owner_id_check',
        },
      },
      owner_id_check: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // Iterative plugin spawns child → fires this on success
          OWNER_KYC_SPAWNED: [{ target: 'pending_owner_kyc' }],
          OWNER_KYC_FAILED: [{ target: 'manual_review' }],
        },
      },
      /**
       * Wait for owner KYC child workflow to complete.
       * The childCallbackResults config listens for the child entering
       * approved/rejected/manual_review and delivers OWNER_KYC_RESPONDED.
       */
      pending_owner_kyc: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          OWNER_KYC_RESPONDED: [
            {
              target: 'business_photo_classification',
              cond: {
                type: 'jmespath',
                options: {
                  // Continue only when owner KYC child is explicitly approved.
                  rule: "childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags[?@ == 'approved']]) > `0`",
                },
              },
            },
            {
              target: 'pending_owner_resubmission',
              cond: {
                type: 'jmespath',
                options: {
                  // Recoverable input gap: no owner media and/or weak device signal.
                  // Route to revision instead of manual review.
                  rule: "length(childWorkflows.kyc_onboarding_sierra_leone.*[?contains(result.vendorResult.document_verification.failedAttributes || result.vendorResult.document_verification.data.failedAttributes || [], 'no_methods_executed') || contains(result.vendorResult.facial_verification.failedAttributes || result.vendorResult.facial_verification.data.failedAttributes || [], 'no_methods_executed') || contains(to_string(result.vendorResult.device_dedup_check.errorCode || result.vendorResult.device_dedup_check.data.errorCode || result.vendorResult.device_dedup_check.error || result.vendorResult.device_dedup_check.data.error || result.vendorResult.device_dedup_check.reason || result.vendorResult.device_dedup_check.data.reason || ''), 'INSUFFICIENT_DEVICE_DATA')]) > `0`",
                },
              },
            },
            {
              target: 'manual_review',
            },
          ],
        },
      },
      pending_owner_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          EMAIL_SENT: 'owner_revision',
          EMAIL_FAILURE: 'manual_review',
          RESUBMITTED: 'owner_id_check',
          COLLECTION_FLOW_FINISHED: 'owner_id_check',
          RETURN_TO_REVIEW: 'manual_review',
        },
      },
      owner_revision: {
        tags: [StateTag.REVISION],
        on: {
          REVISION: 'pending_owner_resubmission',
          RESUBMITTED: 'owner_id_check',
          COLLECTION_FLOW_FINISHED: 'owner_id_check',
          RETURN_TO_REVIEW: 'manual_review',
        },
      },
      /**
       * Business Photo Classification — AI Analysis
       *
       * Analyzes photos of the business premises to:
       * - Confirm business type matches declaration (e.g., retail shop has stock/shelves)
       * - Assess business viability (stock levels, equipment, condition)
       * - Detect business category indicators (buckets, produce, sewing machines, etc.)
       * - Provide confidence score for the business assessment
       *
       * Calls Document API POST /api/v1/documents/analyze-photo via Unified API.
       * Non-blocking: proceeds to market_card_verification even if no photos or failure.
       */
      business_photo_classification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          BUSINESS_PHOTO_CLASSIFIED: [{ target: 'market_card_verification' }],
          BUSINESS_PHOTO_FAILED: [{ target: 'market_card_verification' }], // Non-blocking
        },
        // If no business photos, auto-transition
        always: [
          {
            target: 'market_card_verification',
            cond: {
              type: 'jmespath',
              options: {
                // Prefer Ballerine's canonical category `proof_of_location` for premises photos.
                // Keep `proof_of_business` as a backward-compatible alias for already-seeded flows.
                rule: "length(documents[?category=='business_photo' || category=='proof_of_location' || category=='proof_of_business']) == `0`",
              },
            },
          },
        ],
      },
      market_card_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          MARKET_CARD_VERIFIED: [{ target: 'address_verification' }],
          MARKET_CARD_FAILED: [{ target: 'address_verification' }], // Non-blocking — proceed even if failed
        },
        // If no market card document, auto-transition
        always: [
          {
            target: 'address_verification',
            cond: {
              type: 'jmespath',
              options: {
                rule: "length(documents[?type=='market_association_card']) == `0`",
              },
            },
          },
        ],
      },
      address_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          ADDRESS_VERIFIED: [{ target: 'risk_evaluation' }],
          ADDRESS_VERIFICATION_FAILED: [{ target: 'manual_review' }],
        },
      },
      risk_evaluation: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            // Lower threshold for informal businesses
            // Auto-approve if owner KYC approved and address verified (or no address doc)
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: `childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags[?@ == 'approved']]) > \`0\` && (pluginsOutput.address_verification.verificationStatus == 'VERIFIED' || pluginsOutput.address_verification == null)`,
              },
            },
          },
          {
            target: 'manual_review',
          },
        ],
      },
      ...generateBaseCaseLevelStatesWithPendingResubmission({
        resumeState: 'business_photo_classification',
      }),
    },
  },
  extensions: {
    apiPlugins: [
      // ──────────────────────────────────────────────────────────────────────
      // Business Photo Classification
      // Calls Unified API which routes to Document API POST /api/v1/documents/analyze-photo
      // Analyzes business premises photos to confirm business type and viability.
      // Categories analyzed: stock levels, equipment, business signage, premises condition.
      // Non-blocking — result stored for risk evaluation and manual review reference.
      // ──────────────────────────────────────────────────────────────────────
      {
        name: 'business_photo_classification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/document/analyze-photo`,
        method: 'POST',
        stateNames: ['business_photo_classification'],
        successAction: 'BUSINESS_PHOTO_CLASSIFIED',
        errorAction: 'BUSINESS_PHOTO_FAILED',
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
                images: documents[?category=='business_photo' || category=='proof_of_location' || category=='proof_of_business'].pages[].{
                  remote: {
                    imageUri: uri,
                    mimeType: type || 'image/jpeg'
                  }
                },
                businessType: entity.data.businessType,
                supportedCountries: ['SL'],
                callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.business_photo_classification.data&processName=business-photo-analysis-unified-api'])
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: "merge(@, { name: 'business_photo_classification', status: 'SUCCESS' })",
            },
          ],
        },
      },
      // ──────────────────────────────────────────────────────────────────────
      // Market Card Verification
      // Calls Unified API POST /api/v1/verification/kyb with BUSINESS_DOCUMENT_VERIFICATION
      // Verifies Market Association Card (replaces Certificate of Incorporation for informal businesses)
      // Non-blocking — many informal businesses may not have a market card.
      // ──────────────────────────────────────────────────────────────────────
      {
        name: 'market_card_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyb`,
        method: 'POST',
        stateNames: ['market_card_verification'],
        successAction: 'MARKET_CARD_VERIFIED',
        errorAction: 'MARKET_CARD_FAILED',
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
                business: {
                  id: entity.id,
                  name: entity.data.businessName || entity.data.companyName,
                  entityType: entity.data.businessType,
                  address: entity.data.address,
                  documents: documents[?type=='market_association_card'].{
                    type: type,
                    category: category,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['BUSINESS_DOCUMENT_VERIFICATION'],
                countryCode: 'SL',
                callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.market_card_verification.data&processName=market-card-verification-unified-api'])
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "merge(@, { name: 'market_card_verification', verificationStatus: status, status: status == 'PENDING' && 'IN_PROGRESS' || status == 'ERROR' && 'ERROR' || status == 'EXPIRED' && 'ERROR' || 'SUCCESS' })",
            },
          ],
        },
      },
      // ──────────────────────────────────────────────────────────────────────
      // Address Verification
      // Calls Unified API POST /api/v1/verification/kyb with BUSINESS_ADDRESS_VERIFICATION
      // Verifies business address via community leader letter, utility bills.
      // ──────────────────────────────────────────────────────────────────────
      {
        name: 'address_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyb`,
        method: 'POST',
        stateNames: ['address_verification'],
        successAction: 'ADDRESS_VERIFIED',
        errorAction: 'ADDRESS_VERIFICATION_FAILED',
        headers: {
          Authorization: `Bearer {secret.UNIFIED_API_TOKEN}`,
          'Content-Type': 'application/json',
          'x-tenant-id': '{entity.data.tenantId}',
          'x-project-id': '{entity.data.projectId}',
        },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
                business: {
                  id: entity.id,
                  name: entity.data.businessName || entity.data.companyName,
                  address: entity.data.address,
                  documents: documents[?category=='proof_of_address' || category=='proof_of_location'].{
                    type: type,
                    category: category,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['BUSINESS_ADDRESS_VERIFICATION'],
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
        name: 'resubmission_email',
        pluginKind: 'template-email',
        template: 'resubmission',
        successAction: 'EMAIL_SENT',
        errorAction: 'EMAIL_FAILURE',
        stateNames: ['pending_resubmission', 'pending_owner_resubmission'],
      },
    ],
    childWorkflowPlugins: [
      {
        pluginKind: 'child',
        name: 'owner_kyc_child_plugin',
        definitionId: kycOnboardingSierraLeoneDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            // join() requires Array<string>; `entity.id || ''` avoids runtime type errors during transform.
            // Keep the expression simple to avoid runtime output-schema inference edge-cases.
            mapping: `{
              entity: {
                type: 'individual',
                id: join('-', ['owner', entity.id || '']),
                data: {
                  firstName: entity.data.ownerFirstName || entity.data.additionalInfo.owner.firstName,
                  lastName: entity.data.ownerLastName || entity.data.additionalInfo.owner.lastName,
                  nationalId: entity.data.ownerNationalId || entity.data.additionalInfo.owner.nationalId,
                  dateOfBirth: entity.data.additionalInfo.owner.dateOfBirth,
                  phoneNumber: entity.data.ownerPhoneNumber || entity.data.additionalInfo.owner.phoneNumber || entity.data.phoneNumber,
                  email: entity.data.ownerEmail || entity.data.additionalInfo.owner.email || entity.data.email,
                  address: entity.data.address,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId,
                  fingerprintJsDeviceId: entity.data.device.fingerprintJsDeviceId || entity.data.fingerprintJsDeviceId,
                  fingerprintJsDeviceHash: entity.data.device.fingerprintJsDeviceHash || entity.data.fingerprintJsDeviceHash,
                  deviceFingerprint: entity.data.device.deviceFingerprint || entity.data.deviceFingerprint,
                  deviceFirebaseInstallationId: entity.data.device.deviceFirebaseInstallationId || entity.data.deviceFirebaseInstallationId,
                  deviceLocalInstallationId: entity.data.device.deviceLocalInstallationId || entity.data.deviceLocalInstallationId,
                  deviceImei: entity.data.device.deviceImei || entity.data.deviceImei,
                  deviceModel: entity.data.device.deviceModel || entity.data.deviceModel,
                  deviceBrand: entity.data.device.deviceBrand || entity.data.deviceBrand,
                  deviceUserAgent: entity.data.device.deviceUserAgent || entity.data.deviceUserAgent,
                  deviceIp: entity.data.device.deviceIp || entity.data.device.networkIpAddresses[0] || entity.data.deviceIp
                }
              },
              documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership'] || entity.data.additionalInfo.owner.documents || []
            }`,
          },
        ],
        initEvent: 'start_with_documents',
      },
    ],
    commonPlugins: [
      // Single child workflow for the sole proprietor (NOT iterative)
      {
        pluginKind: 'iterative',
        name: 'owner_kyc_single',
        actionPluginName: 'owner_kyc_child_plugin',
        stateNames: ['owner_id_check'],
        iterateOn: [
          {
            transformer: 'jmespath',
            // IterativePlugin passes each array item as the "context" to the action plugin.
            // For sole-proprietor KYB we want the child plugin to receive the FULL workflow context
            // (entity + documents), not just the owner object.
            mapping: '[@]',
          },
        ],
        successAction: 'OWNER_KYC_SPAWNED',
        errorAction: 'OWNER_KYC_FAILED',
      },
    ],
  },
  config: {
    workflowLevelResolution: true,
    createCollectionFlowToken: true,
    language: 'en',
    supportedLanguages: ['en'],
    // UI feature flags
    isCaseOverviewEnabled: true,
    isCaseRiskOverviewEnabled: true,
    isDocumentsV2: true,
    isDocumentTrackerEnabled: true,
    isCollectionFlowPageRevisionEnabled: true,
    theme: { type: 'kyb' },
    childCallbackResults: [
      {
        definitionId: kycOnboardingSierraLeoneDefinition.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '{childEntity: entity.data, vendorResult: pluginsOutput}',
          },
        ],
        persistenceStates: ['approved', 'rejected', 'manual_review'],
        deliverEvent: 'OWNER_KYC_RESPONDED',
      },
    ],
  },
  contextSchema: {
    type: 'json-schema',
    schema: Type.Composite([
      defaultContextSchema,
      Type.Object({
        entity: Type.Object({
          type: Type.Literal('business'),
          id: Type.String(),
          data: Type.Object({
            companyName: Type.Optional(Type.String()),
            businessName: Type.Optional(Type.String()),
            businessType: Type.String(), // Sole Proprietorship, Informal Trader, Petty Trader, Market Vendor
            tradingName: Type.Optional(Type.String()),
            industry: Type.Optional(Type.String()),
            phoneNumber: Type.Optional(Type.String()),
            email: Type.Optional(Type.String()),
            country: Type.Optional(Type.String({ default: 'SL' })),
            address: Type.Optional(
              Type.Object({
                line1: Type.Optional(Type.String()),
                city: Type.Optional(Type.String()),
                district: Type.Optional(Type.String()),
                market: Type.Optional(Type.String()), // e.g., "Lumley Market", "Big Market"
                country: Type.Optional(Type.String({ default: 'SL' })),
              }),
            ),
            // Owner info (sole proprietor)
            ownerFirstName: Type.Optional(Type.String()),
            ownerLastName: Type.Optional(Type.String()),
            ownerNationalId: Type.Optional(Type.String()),
            ownerPhoneNumber: Type.Optional(Type.String()),
            ownerEmail: Type.Optional(Type.String()),
            device: Type.Optional(
              Type.Object({
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
                networkIpAddresses: Type.Optional(Type.Array(Type.String())),
              }),
            ),
            additionalInfo: Type.Optional(
              Type.Object({
                owner: Type.Optional(
                  Type.Object({
                    firstName: Type.String(),
                    lastName: Type.String(),
                    nationalId: Type.Optional(Type.String()),
                    dateOfBirth: Type.Optional(Type.String()),
                    phoneNumber: Type.Optional(Type.String()),
                    email: Type.Optional(Type.String()),
                    documents: Type.Optional(Type.Array(Type.Any())),
                  }),
                ),
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
  variant: WorkflowDefinitionVariant.KYB,
};

export const generateKybOnboardingSierraLeoneInformal = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = kybOnboardingSierraLeoneInformalDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
