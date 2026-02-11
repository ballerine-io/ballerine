import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { env } from '../../../src/env';
import { kycOnboardingSierraLeoneDefinition } from './kyc-onboarding-sierra-leone';

export const kybOnboardingSierraLeoneFormalDefinition = {
  id: 'kyb_onboarding_sierra_leone_formal',
  name: 'kyb_onboarding_sierra_leone_formal',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_onboarding_sierra_leone_formal_v1',
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
          // Backend-only shortcut when the caller already provided business documents.
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
            target: 'business_document_check',
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
          DEVICE_INDEX_FAILED: [{ target: 'business_document_check' }], // Fail-open
        },
      },
      device_linking: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          DEVICE_LINKED: [{ target: 'device_routing' }],
          DEVICE_LINK_FAILED: [{ target: 'business_document_check' }], // Fail-open
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
          { target: 'business_document_check' },
        ],
      },
      business_document_check: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          BUSINESS_DOCS_VERIFIED: [{ target: 'business_registry_check' }],
          BUSINESS_DOCS_FAILED: [{ target: 'manual_review' }],
        },
      },
      business_registry_check: {
        tags: [StateTag.PENDING_PROCESS],
        // Stub: auto-transition until Sierra Leone business registry API is available
        always: [
          {
            target: 'run_director_kyc',
          },
        ],
      },
      run_director_kyc: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          CONTINUE: [{ target: 'pending_director_kyc' }],
          FAILED: [{ target: 'manual_review' }],
        },
      },
      pending_director_kyc: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_RESPONDED: [
            {
              target: 'address_verification',
              cond: {
                type: 'jmespath',
                options: {
                  rule: 'length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags != null]) == length(childWorkflows.kyc_onboarding_sierra_leone.*[])',
                },
              },
            },
          ],
        },
        always: [
          {
            target: 'address_verification',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.additionalInfo.directors == null || length(entity.data.additionalInfo.directors) == `0`',
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
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: `pluginsOutput.business_document_verification.status == 'VERIFIED' && pluginsOutput.address_verification.status == 'VERIFIED' && (pluginsOutput.business_document_verification.confidenceScore || \`0\`) >= \`80\``,
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
                  workflow: 'kyb_onboarding_sierra_leone_formal',
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
        name: 'business_document_verification',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/verification/kyb`,
        method: 'POST',
        stateNames: ['business_document_check'],
        successAction: 'BUSINESS_DOCS_VERIFIED',
        errorAction: 'BUSINESS_DOCS_FAILED',
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
                  registrationNumber: entity.data.registrationNumber,
                  name: entity.data.companyName,
                  tradingName: entity.data.tradingName,
                  entityType: entity.data.businessType,
                  taxId: entity.data.taxIdNumber,
                  industry: entity.data.industry,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  address: entity.data.address,
                  documents: documents[?category=='business_document' || category=='proof_of_registration' || category=='proof_of_ownership'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL',
                    number: properties.registrationNumber || properties.licenseNumber
                  }
                },
                methods: ['BUSINESS_DOCUMENT_VERIFICATION'],
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
                  name: entity.data.companyName,
                  address: entity.data.address,
                  documents: documents[?category=='proof_of_address' || category=='proof_of_location'].{
                    type: type,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL'
                  }
                },
                methods: ['BUSINESS_ADDRESS_VERIFICATION'],
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
        name: 'director_kyc_child_plugin',
        definitionId: kycOnboardingSierraLeoneDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{
              entity: {
                type: 'individual',
                id: join('-', ['director', id || '']),
                data: {
                  firstName: firstName,
                  lastName: lastName,
                  nationalId: nationalId,
                  dateOfBirth: dateOfBirth,
                  phoneNumber: phoneNumber,
                  email: email,
                  country: 'SL',
                  tenantId: tenantId,
                  projectId: projectId
                }
              },
              documents: documents || []
            }`,
          },
        ],
        // Directors are collected as part of the parent KYB flow; no separate webview is expected.
        initEvent: 'start_with_documents',
      },
    ],
    commonPlugins: [
      {
        pluginKind: 'iterative',
        name: 'directors_iterative',
        actionPluginName: 'director_kyc_child_plugin',
        stateNames: ['run_director_kyc'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: `entity.data.additionalInfo.directors[].{
              id: @.id || @.nationalId || '',
              firstName: @.firstName,
              lastName: @.lastName,
              nationalId: @.nationalId,
              dateOfBirth: @.dateOfBirth,
              phoneNumber: @.phoneNumber,
              email: @.email,
              documents: @.documents || [],
              tenantId: entity.data.tenantId,
              projectId: entity.data.projectId
            }`,
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
        deliverEvent: 'KYC_RESPONDED',
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
            companyName: Type.String(),
            tradingName: Type.Optional(Type.String()),
            registrationNumber: Type.Optional(Type.String()),
            businessType: Type.String(), // LLC, Corporation, Partnership, Registered Company
            taxIdNumber: Type.Optional(Type.String()),
            industry: Type.Optional(Type.String()),
            phoneNumber: Type.Optional(Type.String()),
            email: Type.Optional(Type.String()),
            ownerId: Type.Optional(Type.String()),
            website: Type.Optional(Type.String()),
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
            device: Type.Optional(Type.Any()),
            additionalInfo: Type.Optional(
              Type.Object({
                directors: Type.Optional(
                  Type.Array(
                    Type.Object({
                      id: Type.Optional(Type.String()),
                      firstName: Type.String(),
                      lastName: Type.String(),
                      nationalId: Type.Optional(Type.String()),
                      dateOfBirth: Type.Optional(Type.String()),
                      phoneNumber: Type.Optional(Type.String()),
                      email: Type.Optional(Type.String()),
                      role: Type.Optional(Type.String()),
                      documents: Type.Optional(Type.Array(Type.Any())),
                    }),
                  ),
                ),
                ubos: Type.Optional(
                  Type.Array(
                    Type.Object({
                      id: Type.Optional(Type.String()),
                      firstName: Type.String(),
                      lastName: Type.String(),
                      nationalId: Type.Optional(Type.String()),
                      dateOfBirth: Type.Optional(Type.String()),
                      ownershipPercentage: Type.Optional(Type.Number()),
                      documents: Type.Optional(Type.Array(Type.Any())),
                    }),
                  ),
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

export const generateKybOnboardingSierraLeoneFormal = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = kybOnboardingSierraLeoneFormalDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
