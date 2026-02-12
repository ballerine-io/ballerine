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
 * Formal KYB (Know Your Business) Onboarding Workflow for Sierra Leone.
 *
 * For registered businesses (LLC, Corporation, Partnership, Registered Company)
 * that have formal registration documents.
 *
 * Steps:
 * 1. Data collection (business documents, registration certificates)
 * 2. Business document verification (Certificate of Incorporation, business license)
 *    via Unified API → Document API (BUSINESS_DOCUMENT_VERIFICATION method)
 * 3. Business registry check — STUB (SL business registry API not yet available)
 * 4. Director KYC — Spawns child KYC workflow per director (iterative)
 * 5. Address verification (proof of address, utility bills)
 *    via Unified API → Document API (BUSINESS_ADDRESS_VERIFICATION method)
 * 6. Risk evaluation (aggregates all results, auto-approve if confidence >= 80)
 *
 * Auto-approval requires:
 * - Business documents VERIFIED with confidence >= 80
 * - Address VERIFIED
 * - All director KYC workflows approved
 */
export const kybOnboardingSierraLeoneFormalDefinition = {
  id: 'kyb_onboarding_sierra_leone_formal',
  name: 'kyb_onboarding_sierra_leone_formal',
  version: 1,
  definitionType: 'statechart-json',
  // SL document schemas for formal KYB-relevant categories.
  // Includes identity docs (for director KYC child workflows),
  // registration docs, address proofs, and financial documents.
  documentsSchema: getDocumentsByCountry('SL').filter(doc =>
    [
      'proof_of_identity',
      'proof_of_identity_ownership',
      'business_document',
      'proof_of_registration',
      'proof_of_address',
      'proof_of_ownership',
      'proof_of_employment',
      'financial_information',
    ].includes(doc.category),
  ),
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
          // Programmatic start (e.g., LoanCube) when documents are already present in context.
          start_with_documents: 'business_document_check',
        },
      },
      data_collection: {
        tags: [StateTag.COLLECTION_FLOW],
        on: {
          // Ballerine collection-flow app sends this on final submission.
          COLLECTION_FLOW_FINISHED: 'business_document_check',
          // Legacy alias (kept for backwards compatibility with any custom clients).
          COLLECTION_COMPLETED: 'business_document_check',
        },
      },
      /**
       * Business Document Verification
       * Verifies Certificate of Incorporation, business license, registration docs.
       * Calls Unified API with method BUSINESS_DOCUMENT_VERIFICATION which routes to
       * Document API for AI-powered document classification, extraction, and validation.
       */
      business_document_check: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          BUSINESS_DOCS_VERIFIED: [{ target: 'business_registry_check' }],
          BUSINESS_DOCS_FAILED: [{ target: 'manual_review' }],
        },
      },
      /**
       * Business Registry Check — STUB
       *
       * Sierra Leone does not yet have a public API for business registration
       * verification. When available (OARG — Office of the Administrator and
       * Registrar General), this state should:
       * 1. Query the SL business registry with registrationNumber
       * 2. Confirm business name, directors, registration status
       * 3. Cross-reference with tax authority (NRA)
       *
       * For now: auto-transitions to run_director_kyc (pass-through).
       *
       * TODO: Implement SL business registry integration
       * Contact: OARG, Roxy Building, Gloucester Street, Freetown
       */
      business_registry_check: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            // Avoid respawning director child workflows on resubmissions/reruns; if they already exist,
            // proceed directly to address verification.
            target: 'address_verification',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[]) > `0`',
              },
            },
          },
          {
            target: 'run_director_kyc',
          },
        ],
      },
      /**
       * Director KYC
       * Spawns a child kyc_onboarding_sierra_leone workflow for each director
       * listed in entity.data.additionalInfo.directors. Uses the iterative plugin
       * to handle multiple directors.
       */
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
                  // All director KYC child workflows have completed (have tags set)
                  rule: 'length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags != null]) == length(childWorkflows.kyc_onboarding_sierra_leone.*[])',
                },
              },
            },
          ],
        },
        always: [
          {
            // Skip if no directors listed
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
      /**
       * Address Verification
       * Verifies business address via proof of address documents (utility bills,
       * lease agreements, community leader letters).
       * Calls Unified API with method BUSINESS_ADDRESS_VERIFICATION.
       */
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
                // Auto-approve if:
                // 1. Business docs VERIFIED
                // 2. Address VERIFIED
                // 3. Confidence >= 80
                // 4. If directors are provided, require ALL director KYC child workflows to be approved
                rule: `pluginsOutput.business_document_verification.verificationStatus == 'VERIFIED' && pluginsOutput.address_verification.verificationStatus == 'VERIFIED' && (pluginsOutput.business_document_verification.confidenceScore || \`0\`) >= \`80\` && (entity.data.additionalInfo.directors == null || length(entity.data.additionalInfo.directors) == \`0\` || (childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags[?@ == 'approved']]) == length(entity.data.additionalInfo.directors)))`,
              },
            },
          },
          {
            target: 'manual_review',
          },
        ],
      },
      ...generateBaseCaseLevelStatesWithPendingResubmission({
        resumeState: 'business_document_check',
      }),
    },
  },
  extensions: {
    apiPlugins: [
      // ──────────────────────────────────────────────────────────────────────
      // Business Document Verification
      // Calls Unified API POST /api/v1/verification/kyb with method BUSINESS_DOCUMENT_VERIFICATION
      // Sends registration certificates, business licenses, ownership documents.
      // Unified API → Document API classifies, extracts, and validates.
      // ──────────────────────────────────────────────────────────────────────
      {
        name: 'business_document_verification',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/verification/kyb`,
        method: 'POST',
        stateNames: ['business_document_check'],
        successAction: 'BUSINESS_DOCS_VERIFIED',
        errorAction: 'BUSINESS_DOCS_FAILED',
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
                    category: category,
                    frontImageUrl: pages[0].uri,
                    issuingCountry: 'SL',
                    number: properties.registrationNumber || properties.licenseNumber
                  }
                },
                methods: ['BUSINESS_DOCUMENT_VERIFICATION'],
                countryCode: 'SL',
                callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.business_document_verification.data&processName=business-document-verification-unified-api'])
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "merge(@, { name: 'business_document_verification', verificationStatus: status, status: status == 'PENDING' && 'IN_PROGRESS' || status == 'ERROR' && 'ERROR' || status == 'EXPIRED' && 'ERROR' || 'SUCCESS' })",
            },
          ],
        },
      },
      // ──────────────────────────────────────────────────────────────────────
      // Address Verification
      // Calls Unified API POST /api/v1/verification/kyb with method BUSINESS_ADDRESS_VERIFICATION
      // Sends proof of address documents (utility bills, lease agreements).
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
                  name: entity.data.companyName,
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
                id: join('-', ['director', @.id || '']),
                data: {
                  firstName: @.firstName,
                  lastName: @.lastName,
                  nationalId: @.nationalId,
                  dateOfBirth: @.dateOfBirth,
                  phoneNumber: @.phoneNumber,
                  email: @.email,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId
                }
              },
              documents: @.documents || []
            }`,
          },
        ],
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
            mapping: 'entity.data.additionalInfo.directors',
          },
        ],
        successAction: 'CONTINUE',
        errorAction: 'FAILED',
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
        deliverEvent: 'KYC_RESPONDED',
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
            companyName: Type.String(),
            tradingName: Type.Optional(Type.String()),
            registrationNumber: Type.Optional(Type.String()),
            businessType: Type.String(), // LLC, Corporation, Partnership, Registered Company
            taxIdNumber: Type.Optional(Type.String()),
            industry: Type.Optional(Type.String()),
            phoneNumber: Type.Optional(Type.String()),
            email: Type.Optional(Type.String()),
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
  variant: WorkflowDefinitionVariant.KYB,
};

export const generateKybOnboardingSierraLeoneFormal = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = kybOnboardingSierraLeoneFormalDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
