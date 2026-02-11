import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { env } from '../../../src/env';
import { kycOnboardingSierraLeoneDefinition } from './kyc-onboarding-sierra-leone';

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
 */
export const kybOnboardingSierraLeoneInformalDefinition = {
  id: 'kyb_onboarding_sierra_leone_informal',
  name: 'kyb_onboarding_sierra_leone_informal',
  version: 1,
  definitionType: 'statechart-json',
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
          // Backend-only shortcut when the caller already provided owner + business documents.
          start_with_documents: 'device_deduplication',
        },
      },
      data_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          COLLECTION_COMPLETED: 'device_deduplication',
          // Backwards-compatibility with older collection-flow UIs.
          COLLECTION_FLOW_FINISHED: 'device_deduplication',
        },
      },
      device_deduplication: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // Always proceed to indexing; we route to manual review later based on link-based risk signals.
          DEVICE_DEDUP_COMPLETED: [{ target: 'device_indexing' }],
          DEVICE_DEDUP_FAILED: [{ target: 'device_indexing' }], // Fail-open
        },
        always: [
          {
            target: 'kyc_gate',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.device == null || length(entity.data.device) == `0`',
              },
            },
          },
        ],
      },
      device_indexing: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          DEVICE_INDEXED: [{ target: 'device_linking' }],
          DEVICE_INDEX_FAILED: [{ target: 'kyc_gate' }], // Fail-open
        },
      },
      device_linking: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          DEVICE_LINKED: [{ target: 'device_routing' }],
          DEVICE_LINK_FAILED: [{ target: 'kyc_gate' }], // Fail-open
        },
      },
      device_routing: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            target: 'manual_review',
            cond: {
              type: 'jmespath',
              options: {
                rule: '(pluginsOutput.device_linking.risk.userCount || `0`) > `1`',
              },
            },
          },
          { target: 'kyc_gate' },
        ],
      },
      kyc_gate: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            target: 'market_card_verification',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.kycVerified == `true`',
              },
            },
          },
          {
            target: 'owner_id_check',
          },
        ],
      },
      owner_id_check: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // Spawn the owner KYC child workflow(s), then wait for callback results.
          CONTINUE: [{ target: 'pending_owner_kyc' }],
          FAILED: [{ target: 'manual_review' }],
        },
      },
      pending_owner_kyc: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // Delivered from childCallbackResults when the child KYC workflow completes.
          OWNER_KYC_RESPONDED: [{ target: 'market_card_verification' }],
          // Backwards-compatibility with older deliverEvent names.
          OWNER_KYC_DONE: [{ target: 'market_card_verification' }],
          OWNER_KYC_FAILED: [{ target: 'manual_review' }],
        },
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
            // Lower threshold for informal businesses (70 vs 80 for formal)
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: `(entity.data.kycVerified == \`true\` || (childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags[?@ == 'APPROVED']]) > \`0\`)) && (pluginsOutput.address_verification.status == 'VERIFIED' || pluginsOutput.address_verification == null)`,
              },
            },
          },
          {
            target: 'manual_review',
          },
        ],
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'revision',
        },
      },
      revision: {
        tags: [StateTag.REVISION],
        always: [
          {
            target: 'pending_resubmission',
          },
        ],
      },
      pending_resubmission: {
        tags: [StateTag.REVISION],
        on: {
          // Fired by the resubmission email plugin.
          EMAIL_SENT: 'pending_resubmission',
          EMAIL_FAILURE: 'pending_resubmission',
          RESUBMITTED: 'manual_review',
        },
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'device_deduplication_check',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/entity-resolution/devices/check-duplicate`,
        method: 'POST',
        stateNames: ['device_deduplication'],
        successAction: 'DEVICE_DEDUP_COMPLETED',
        errorAction: 'DEVICE_DEDUP_FAILED',
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
                device: entity.data.device,
                countryCode: 'SL',
                searchScope: 'local'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@',
            },
          ],
        },
      },
      {
        name: 'device_indexing',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/entity-resolution/devices/index`,
        method: 'POST',
        stateNames: ['device_indexing'],
        successAction: 'DEVICE_INDEXED',
        errorAction: 'DEVICE_INDEX_FAILED',
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
                device: entity.data.device,
                canonicalDeviceId: pluginsOutput.device_deduplication_check.duplicateIds[0],
                countryCode: 'SL'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@',
            },
          ],
        },
      },
      {
        name: 'device_linking',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/entity-resolution/devices/link-person`,
        method: 'POST',
        stateNames: ['device_linking'],
        successAction: 'DEVICE_LINKED',
        errorAction: 'DEVICE_LINK_FAILED',
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
                personId: entity.data.ownerId,
                deviceId: pluginsOutput.device_indexing.documentId,
                confidence: \`1\`,
                evidence: {
                  source: 'ballerine',
                  workflow: 'kyb_onboarding_sierra_leone_informal',
                  businessId: entity.id,
                  deviceDedup: pluginsOutput.device_deduplication_check
                }
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@',
            },
          ],
        },
      },
      {
        name: 'market_card_verification',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/verification/kyb`,
        method: 'POST',
        stateNames: ['market_card_verification'],
        successAction: 'MARKET_CARD_VERIFIED',
        errorAction: 'MARKET_CARD_FAILED',
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
                  entityType: entity.data.businessType,
                  address: entity.data.address,
                  documents: documents[?type=='market_association_card'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['BUSINESS_DOCUMENT_VERIFICATION'],
                countryCode: 'SL'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@',
            },
          ],
        },
      },
      {
        name: 'address_verification',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/verification/kyb`,
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
                  entityType: entity.data.businessType,
                  address: entity.data.address,
                  documents: documents[?category=='proof_of_address' || category=='proof_of_location'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['BUSINESS_ADDRESS_VERIFICATION'],
                performDeduplication: true,
                countryCode: 'SL'
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '@',
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
        stateNames: ['pending_resubmission'],
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
            mapping: `{
              entity: {
                type: 'individual',
                id: join('-', ['owner', businessId || '']),
                data: {
                  firstName: owner.firstName,
                  lastName: owner.lastName,
                  nationalId: owner.nationalId,
                  dateOfBirth: owner.dateOfBirth,
                  phoneNumber: owner.phoneNumber || phoneNumber,
                  email: owner.email || email,
                  country: 'SL',
                  tenantId: tenantId,
                  projectId: projectId
                }
              },
              documents: owner.documents || []
            }`,
          },
        ],
        // The owner KYC is derived from documents provided in the KYB flow; no separate webview is expected.
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
            // Wrap owner in array since iterative plugin expects array
            mapping: `[
              {
                owner: entity.data.additionalInfo.owner,
                businessId: entity.id,
                tenantId: entity.data.tenantId,
                projectId: entity.data.projectId,
                email: entity.data.email,
                phoneNumber: entity.data.phoneNumber
              }
            ]`,
          },
        ],
        successAction: 'CONTINUE',
        errorAction: 'FAILED',
      },
    ],
  },
  config: {
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
    createCollectionFlowToken: true,
    language: 'en',
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
            ownerId: Type.Optional(Type.String()),
            kycVerified: Type.Optional(Type.Boolean()),
            address: Type.Optional(
              Type.Object({
                line1: Type.Optional(Type.String()),
                city: Type.Optional(Type.String()),
                district: Type.Optional(Type.String()),
                market: Type.Optional(Type.String()), // e.g., "Lumley Market", "Big Market"
                country: Type.Optional(Type.String({ default: 'SL' })),
              }),
            ),
            device: Type.Optional(Type.Any()),
            // Owner info (sole proprietor)
            ownerFirstName: Type.Optional(Type.String()),
            ownerLastName: Type.Optional(Type.String()),
            ownerNationalId: Type.Optional(Type.String()),
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
  variant: WorkflowDefinitionVariant.DEFAULT,
};

export const generateKybOnboardingSierraLeoneInformal = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = kybOnboardingSierraLeoneInformalDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
