import { PrismaClient } from '@prisma/client';
import {
  defaultContextSchema,
  getDocumentsByCountry,
  StateTag,
  WorkflowDefinitionVariant,
} from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { kycOnboardingSierraLeoneDefinition } from './kyc-onboarding-sierra-leone';
import { kybOnboardingSierraLeoneFormalDefinition } from './kyb-onboarding-sierra-leone-formal';
import { kybOnboardingSierraLeoneInformalDefinition } from './kyb-onboarding-sierra-leone-informal';
import { generateBaseCaseLevelStatesWithPendingResubmission } from '../generate-base-case-level-states';

/**
 * Loan Application KYC/KYB Workflow for Sierra Leone.
 *
 * Triggered by LoanCube when a loan application requires identity verification.
 * Orchestrates:
 * 1. KYC for the loan applicant (child workflow: kyc_onboarding_sierra_leone)
 * 2. KYB for their business (formal or informal based on business type)
 * 3. Financial analysis (multimodal) via Unified API → Document API /api/v1/document/analyze-financial
 *    Produces underwriting-grade signals (authenticity, quality, estimated income, concerns) instead of extraction-only.
 * 4. Callback to LoanCube with verification result
 *
 * Business type determination for KYB:
 * - If businessType in INFORMAL_BUSINESS_TYPES AND no registrationNumber → informal KYB
 * - If no businessName and no businessType → skip KYB entirely
 * - Otherwise → formal KYB
 */

// Informal business types that don't require formal registration
const INFORMAL_BUSINESS_TYPES = [
  'retail',
  'service',
  'food',
  'transport',
  'topup',
  'market',
  'petty',
  'sole_proprietorship',
  'informal_trader',
  'petty_trader',
  'market_vendor',
];

export const loanKycKybSierraLeoneDefinition = {
  id: 'loan_kyc_kyb_sierra_leone',
  name: 'loan_kyc_kyb_sierra_leone',
  version: 1,
  definitionType: 'statechart-json',
  // Full SL document schema set. Loans involve both KYC and KYB documents
  // from any category (identity, business, financial, employment, etc.).
  documentsSchema: getDocumentsByCountry('SL'),
  definition: {
    id: 'loan_kyc_kyb_sierra_leone_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          start: 'kyc_verification',
          // Guard: if child KYC completed before parent left idle (race condition),
          // skip directly to KYB determination instead of failing.
          KYC_CHILD_RESPONDED: [{ target: 'kyb_determination' }],
        },
      },
      /**
       * KYC Verification — Spawn
       * Spawns child kyc_onboarding_sierra_leone workflow for the loan applicant.
       */
      kyc_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_CHILD_SPAWNED: [{ target: 'pending_kyc' }],
          KYC_CHILD_FAILED: [{ target: 'manual_review' }],
          // Guard: child completed faster than spawn acknowledgment
          KYC_CHILD_RESPONDED: [{ target: 'kyb_determination' }],
        },
      },
      /**
       * Wait for KYC child to complete.
       * childCallbackResults delivers KYC_CHILD_RESPONDED when child
       * enters approved/rejected/manual_review.
       */
      pending_kyc: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_CHILD_RESPONDED: [{ target: 'kyb_determination' }],
        },
      },
      /**
       * KYB Determination
       * Routes to the appropriate KYB workflow based on business type:
       * - No business info → skip to loan_document_review
       * - Informal business type + no registration → informal KYB
       * - Everything else → formal KYB
       */
      kyb_determination: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            // Skip KYB if no business info provided
            target: 'loan_document_review',
            cond: {
              type: 'jmespath',
              options: {
                rule: 'entity.data.businessName == null && entity.data.businessType == null',
              },
            },
          },
          {
            // Informal KYB for informal business types without registration
            target: 'kyb_verification_informal',
            cond: {
              type: 'jmespath',
              options: {
                rule: `contains(['${INFORMAL_BUSINESS_TYPES.join(
                  "','",
                )}'], entity.data.businessType) && (entity.data.registrationNumber == null || entity.data.registrationNumber == '')`,
              },
            },
          },
          {
            // Formal KYB for everything else
            target: 'kyb_verification_formal',
          },
        ],
      },
      kyb_verification_formal: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYB_FORMAL_SPAWNED: [{ target: 'pending_kyb_formal' }],
          KYB_CHILD_FAILED: [{ target: 'manual_review' }],
        },
      },
      pending_kyb_formal: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYB_FORMAL_RESPONDED: [{ target: 'loan_document_review' }],
        },
      },
      kyb_verification_informal: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYB_INFORMAL_SPAWNED: [{ target: 'pending_kyb_informal' }],
          KYB_CHILD_FAILED: [{ target: 'manual_review' }],
        },
      },
      pending_kyb_informal: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYB_INFORMAL_RESPONDED: [{ target: 'loan_document_review' }],
        },
      },
      /**
       * Loan Financial Analysis (Multimodal)
       * Analyzes submitted financial documents for underwriting-grade signals:
       * - Authenticity heuristic (possibly edited/forged)
       * - Quality score (readability)
       * - Estimated income / currency / date range (when inferable)
       * Non-blocking on failure — proceeds to financial_analysis regardless.
       * Auto-skips if no financial documents submitted.
       */
      loan_document_review: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          LOAN_FINANCIAL_ANALYZED: [{ target: 'financial_analysis' }],
          LOAN_FINANCIAL_ANALYSIS_FAILED: [{ target: 'financial_analysis' }], // Non-blocking
        },
        // Auto-transition if no loan documents
        always: [
          {
            target: 'financial_analysis',
            cond: {
              type: 'jmespath',
              options: {
                rule: "length(documents[?category=='financial_information' || category=='proof_of_employment']) == `0`",
              },
            },
          },
        ],
      },
      /**
       * Financial Analysis
       * Auto-transitions — summary can be derived from:
       * - pluginsOutput.loan_financial_analysis (underwriting signals)
       */
      financial_analysis: {
        tags: [StateTag.PENDING_PROCESS],
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
                // Auto-approve if:
                // 1. KYC child approved
                // 2. KYB child approved (or no KYB required)
                // 3. Financial analysis (if present) does not flag document as likely forged
                // Guard against missing childWorkflows to avoid length(null) runtime errors.
                rule: `(childWorkflows.kyc_onboarding_sierra_leone != null && length(childWorkflows.kyc_onboarding_sierra_leone.*[?tags[?@ == 'approved']]) > \`0\`) && (childWorkflows.kyb_onboarding_sierra_leone_formal == null && childWorkflows.kyb_onboarding_sierra_leone_informal == null || length(childWorkflows.kyb_onboarding_sierra_leone_formal.*[?tags[?@ == 'approved']] || childWorkflows.kyb_onboarding_sierra_leone_informal.*[?tags[?@ == 'approved']] || []) > \`0\`) && (pluginsOutput.loan_financial_analysis == null || pluginsOutput.loan_financial_analysis.data == null || pluginsOutput.loan_financial_analysis.data.authenticityConfidence == null || pluginsOutput.loan_financial_analysis.data.authenticityConfidence >= \`0.4\`)`,
              },
            },
          },
          {
            target: 'manual_review',
          },
        ],
      },
      ...generateBaseCaseLevelStatesWithPendingResubmission({
        resumeState: 'loan_document_review',
      }),
    },
  },
  extensions: {
    apiPlugins: [
      // ──────────────────────────────────────────────────────────────────────
      // Loan Financial Analysis (Multimodal)
      // Calls Unified API POST /api/v1/document/analyze-financial
      // Produces underwriting-grade signals (authenticity, quality, income estimate).
      // Non-blocking on failure.
      // ──────────────────────────────────────────────────────────────────────
      {
        name: 'loan_financial_analysis',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/api/v1/document/analyze-financial`,
        method: 'POST',
        stateNames: ['loan_document_review'],
        successAction: 'LOAN_FINANCIAL_ANALYZED',
        errorAction: 'LOAN_FINANCIAL_ANALYSIS_FAILED',
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
                images: documents[?category=='financial_information' || category=='proof_of_employment'].pages[].{
                  remote: {
                    imageUri: uri,
                    mimeType: type || 'image/jpeg'
                  },
                  context: metadata.side || metadata.pageNumber || uri
                },
                supportedCountries: ['SL'],
                callbackUrl: join('', ['{secret.APP_API_URL}/api/v1/external/workflows/', workflowRuntimeId, '/hook/{secret.UNIFIED_API_VERIFICATION_HOOK_ID}', '?resultDestination=pluginsOutput.loan_financial_analysis.data&processName=loan-financial-analysis-unified-api'])
              }`,
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: "merge(@, { name: 'loan_financial_analysis', status: 'SUCCESS' })",
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
        name: 'applicant_kyc_child',
        definitionId: kycOnboardingSierraLeoneDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{
              entity: {
                type: 'individual',
                id: join('-', [to_string('loan-applicant'), to_string(entity.id)]),
                data: {
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  nationalId: entity.data.nationalId,
                  dateOfBirth: entity.data.dateOfBirth,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  gender: entity.data.gender,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId,
                  deviceFirebaseInstallationId: entity.data.device.deviceFirebaseInstallationId || entity.data.deviceFirebaseInstallationId,
                  deviceLocalInstallationId: entity.data.device.deviceLocalInstallationId || entity.data.deviceLocalInstallationId,
                  fingerprintJsDeviceId: entity.data.device.fingerprintJsDeviceId || entity.data.fingerprintJsDeviceId,
                  fingerprintJsDeviceHash: entity.data.device.fingerprintJsDeviceHash || entity.data.fingerprintJsDeviceHash,
                  deviceFingerprint: entity.data.device.deviceFingerprint || entity.data.deviceFingerprint,
                  deviceImei: entity.data.device.deviceImei || entity.data.deviceImei,
                  deviceModel: entity.data.device.deviceModel || entity.data.deviceModel,
                  deviceBrand: entity.data.device.deviceBrand || entity.data.deviceBrand,
                  deviceUserAgent: entity.data.device.deviceUserAgent || entity.data.deviceUserAgent,
                  deviceIp: entity.data.device.deviceIp || entity.data.deviceIp || entity.data.networkIp || entity.data.networkIpAddresses[0] || entity.data.device.networkIpAddresses[0] || entity.data.ip
                }
              },
              documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership' || category=='proof_of_address' || category=='proof_of_location']
            }`,
          },
        ],
        initEvent: 'start_with_documents',
      },
      {
        pluginKind: 'child',
        name: 'formal_kyb_child',
        definitionId: kybOnboardingSierraLeoneFormalDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{
              entity: {
                type: 'business',
                id: join('-', [to_string('loan-business'), to_string(entity.id)]),
                data: {
                  companyName: entity.data.businessName,
                  registrationNumber: entity.data.registrationNumber,
                  businessType: entity.data.businessType,
                  taxIdNumber: entity.data.taxIdNumber,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  address: entity.data.businessAddress || entity.data.address,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId,
                  additionalInfo: {
                    directors: entity.data.directors || []
                  }
                }
              },
              documents: documents[?category=='business_document' || category=='proof_of_registration' || category=='proof_of_ownership' || category=='proof_of_address' || category=='proof_of_location']
            }`,
          },
        ],
        initEvent: 'start_with_documents',
      },
      {
        pluginKind: 'child',
        name: 'informal_kyb_child',
        definitionId: kybOnboardingSierraLeoneInformalDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{
              entity: {
                type: 'business',
                id: join('-', [to_string('loan-business'), to_string(entity.id)]),
                data: {
                  businessName: entity.data.businessName,
                  businessType: entity.data.businessType,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  address: entity.data.businessAddress || entity.data.address,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId,
                  ownerPhoneNumber: entity.data.phoneNumber,
                  ownerEmail: entity.data.email,
                  fingerprintJsDeviceId:
                    entity.data.device.fingerprintJsDeviceId || entity.data.fingerprintJsDeviceId,
                  fingerprintJsDeviceHash:
                    entity.data.device.fingerprintJsDeviceHash || entity.data.fingerprintJsDeviceHash,
                  deviceFingerprint:
                    entity.data.device.deviceFingerprint || entity.data.deviceFingerprint,
                  deviceFirebaseInstallationId:
                    entity.data.device.deviceFirebaseInstallationId ||
                    entity.data.deviceFirebaseInstallationId,
                  deviceLocalInstallationId:
                    entity.data.device.deviceLocalInstallationId ||
                    entity.data.deviceLocalInstallationId,
                  deviceImei: entity.data.device.deviceImei || entity.data.deviceImei,
                  deviceModel: entity.data.device.deviceModel || entity.data.deviceModel,
                  deviceBrand: entity.data.device.deviceBrand || entity.data.deviceBrand,
                  deviceUserAgent: entity.data.device.deviceUserAgent || entity.data.deviceUserAgent,
                  deviceIp:
                    entity.data.device.deviceIp ||
                    entity.data.deviceIp ||
                    entity.data.networkIp ||
                    entity.data.networkIpAddresses[0] ||
                    entity.data.device.networkIpAddresses[0] ||
                    entity.data.ip,
                  device: {
                    fingerprintJsDeviceId:
                      entity.data.device.fingerprintJsDeviceId || entity.data.fingerprintJsDeviceId,
                    fingerprintJsDeviceHash:
                      entity.data.device.fingerprintJsDeviceHash || entity.data.fingerprintJsDeviceHash,
                    deviceFingerprint:
                      entity.data.device.deviceFingerprint || entity.data.deviceFingerprint,
                    deviceFirebaseInstallationId:
                      entity.data.device.deviceFirebaseInstallationId ||
                      entity.data.deviceFirebaseInstallationId,
                    deviceLocalInstallationId:
                      entity.data.device.deviceLocalInstallationId ||
                      entity.data.deviceLocalInstallationId,
                    deviceImei: entity.data.device.deviceImei || entity.data.deviceImei,
                    deviceModel: entity.data.device.deviceModel || entity.data.deviceModel,
                    deviceBrand: entity.data.device.deviceBrand || entity.data.deviceBrand,
                    deviceUserAgent: entity.data.device.deviceUserAgent || entity.data.deviceUserAgent,
                    deviceIp:
                      entity.data.device.deviceIp ||
                      entity.data.deviceIp ||
                      entity.data.networkIp ||
                      entity.data.networkIpAddresses[0] ||
                      entity.data.device.networkIpAddresses[0] ||
                      entity.data.ip
                  },
                  additionalInfo: {
                    owner: {
                      firstName: entity.data.firstName,
                      lastName: entity.data.lastName,
                      nationalId: entity.data.nationalId,
                      dateOfBirth: entity.data.dateOfBirth,
                      phoneNumber: entity.data.phoneNumber,
                      email: entity.data.email,
                      documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership']
                    }
                  }
                }
              },
              documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership' || category=='proof_of_address' || category=='proof_of_location' || type=='market_association_card']
            }`,
          },
        ],
        initEvent: 'start_with_documents',
      },
    ],
    commonPlugins: [
      // KYC: single child for the applicant (wrapped in iterative with single-element array)
      {
        pluginKind: 'iterative',
        name: 'applicant_kyc_single',
        actionPluginName: 'applicant_kyc_child',
        stateNames: ['kyc_verification'],
        iterateOn: [
          {
            transformer: 'jmespath',
            // Preserve full parent workflow context so child transformers can access entity + documents.
            mapping: '[@]',
          },
        ],
        successAction: 'KYC_CHILD_SPAWNED',
        errorAction: 'KYC_CHILD_FAILED',
      },
      // Formal KYB child
      {
        pluginKind: 'iterative',
        name: 'formal_kyb_single',
        actionPluginName: 'formal_kyb_child',
        stateNames: ['kyb_verification_formal'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: '[@]',
          },
        ],
        successAction: 'KYB_FORMAL_SPAWNED',
        errorAction: 'KYB_CHILD_FAILED',
      },
      // Informal KYB child
      {
        pluginKind: 'iterative',
        name: 'informal_kyb_single',
        actionPluginName: 'informal_kyb_child',
        stateNames: ['kyb_verification_informal'],
        iterateOn: [
          {
            transformer: 'jmespath',
            mapping: '[@]',
          },
        ],
        successAction: 'KYB_INFORMAL_SPAWNED',
        errorAction: 'KYB_CHILD_FAILED',
      },
    ],
  },
  config: {
    workflowLevelResolution: true,
    // Enable token creation so backoffice can request more docs (revision) and send a collection-flow link.
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
        deliverEvent: 'KYC_CHILD_RESPONDED',
      },
      {
        definitionId: kybOnboardingSierraLeoneFormalDefinition.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '{childEntity: entity.data, vendorResult: pluginsOutput}',
          },
        ],
        persistenceStates: ['approved', 'rejected', 'manual_review'],
        deliverEvent: 'KYB_FORMAL_RESPONDED',
      },
      {
        definitionId: kybOnboardingSierraLeoneInformalDefinition.name,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: '{childEntity: entity.data, vendorResult: pluginsOutput}',
          },
        ],
        persistenceStates: ['approved', 'rejected', 'manual_review'],
        deliverEvent: 'KYB_INFORMAL_RESPONDED',
      },
    ],
    // Webhook subscription — notifies LoanCube when workflow reaches final state.
    // The URL uses secret interpolation; LoanCube's webhook endpoint receives HMAC-signed payloads.
    subscriptions: [
      {
        type: 'webhook',
        url: '{secret.LOANCUBE_CALLBACK_URL}',
        events: ['workflow.completed', 'workflow.state.changed'],
        config: {
          withChildWorkflows: true,
        },
      },
    ],
  },
  contextSchema: {
    type: 'json-schema',
    schema: Type.Composite([
      defaultContextSchema,
      Type.Object({
        entity: Type.Object({
          type: Type.Union([Type.Literal('individual'), Type.Literal('business')]),
          id: Type.String(),
          data: Type.Object({
            // Applicant info (individual)
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
                city: Type.Optional(Type.String()),
                district: Type.Optional(Type.String()),
                country: Type.Optional(Type.String({ default: 'SL' })),
              }),
            ),
            // Business info (if applicable)
            businessName: Type.Optional(Type.String()),
            businessType: Type.Optional(Type.String()),
            registrationNumber: Type.Optional(Type.String()),
            taxIdNumber: Type.Optional(Type.String()),
            businessAddress: Type.Optional(
              Type.Object({
                line1: Type.Optional(Type.String()),
                city: Type.Optional(Type.String()),
                district: Type.Optional(Type.String()),
                market: Type.Optional(Type.String()),
                country: Type.Optional(Type.String({ default: 'SL' })),
              }),
            ),
            directors: Type.Optional(Type.Array(Type.Any())),
            // Loan application reference
            loanApplicationId: Type.Optional(Type.String()),
            loanAmount: Type.Optional(Type.Number()),
            loanCurrency: Type.Optional(Type.String({ default: 'SLL' })),
            loanPurpose: Type.Optional(Type.String()),
            loanTerm: Type.Optional(Type.Number()),
            // Device fingerprint data (forwarded to KYC child for dedup)
            deviceFirebaseInstallationId: Type.Optional(Type.String()),
            deviceLocalInstallationId: Type.Optional(Type.String()),
            fingerprintJsDeviceId: Type.Optional(Type.String()),
            fingerprintJsDeviceHash: Type.Optional(Type.String()),
            deviceFingerprint: Type.Optional(Type.String()),
            deviceImei: Type.Optional(Type.String()),
            deviceModel: Type.Optional(Type.String()),
            deviceBrand: Type.Optional(Type.String()),
            deviceUserAgent: Type.Optional(Type.String()),
            deviceIp: Type.Optional(Type.String()),
            // Tenant scoping
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

export const generateLoanKycKybSierraLeone = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = loanKycKybSierraLeoneDefinition;
  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
