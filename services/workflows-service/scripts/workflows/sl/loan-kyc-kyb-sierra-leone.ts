import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { env } from '../../../src/env';
import { kycOnboardingSierraLeoneDefinition } from './kyc-onboarding-sierra-leone';
import { kybOnboardingSierraLeoneFormalDefinition } from './kyb-onboarding-sierra-leone-formal';
import { kybOnboardingSierraLeoneInformalDefinition } from './kyb-onboarding-sierra-leone-informal';

/**
 * Loan Application KYC/KYB Workflow for Sierra Leone.
 *
 * Triggered by LoanCube when a loan application requires identity verification.
 * Orchestrates:
 * 1. KYC for the loan applicant
 * 2. KYB for their business (formal or informal based on business type)
 * 3. Loan document OCR (income records, bank statements, mobile money statements)
 * 4. Financial analysis
 * 5. Callback to LoanCube with verification result
 *
 * Business type determination for KYB:
 * - If businessType in ['retail','service','food','transport','topup','market','petty']
 *   AND no registrationNumber → informal KYB
 * - Otherwise → formal KYB
 */

// Informal business types that don't require formal registration
const INFORMAL_BUSINESS_TYPES = [
  'retail', 'service', 'food', 'transport', 'topup',
  'market', 'petty', 'sole_proprietorship', 'informal_trader',
  'petty_trader', 'market_vendor',
];

export const loanKycKybSierraLeoneDefinition = {
  id: 'loan_kyc_kyb_sierra_leone',
  name: 'loan_kyc_kyb_sierra_leone',
  version: 1,
  definitionType: 'statechart-json',
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
        },
      },
      kyc_verification: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYC_CHILD_DONE: [{ target: 'kyb_determination' }],
          KYC_CHILD_FAILED: [{ target: 'manual_review' }],
        },
      },
      kyb_determination: {
        tags: [StateTag.PENDING_PROCESS],
        always: [
          {
            // Skip KYB if no business info provided
            target: 'loan_document_review',
            cond: {
              type: 'jmespath',
              options: {
                rule: "entity.data.businessName == null && entity.data.businessType == null",
              },
            },
          },
          {
            // Informal KYB for informal business types without registration
            target: 'kyb_verification_informal',
            cond: {
              type: 'jmespath',
              options: {
                rule: `contains(['${INFORMAL_BUSINESS_TYPES.join("','")}'], entity.data.businessType) && (entity.data.registrationNumber == null || entity.data.registrationNumber == '')`,
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
          KYB_CHILD_DONE: [{ target: 'loan_document_review' }],
          KYB_CHILD_FAILED: [{ target: 'manual_review' }],
        },
      },
      kyb_verification_informal: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          KYB_CHILD_DONE: [{ target: 'loan_document_review' }],
          KYB_CHILD_FAILED: [{ target: 'manual_review' }],
        },
      },
      loan_document_review: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          LOAN_DOCS_REVIEWED: [{ target: 'financial_analysis' }],
          LOAN_DOCS_FAILED: [{ target: 'financial_analysis' }], // Non-blocking
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
      financial_analysis: {
        tags: [StateTag.PENDING_PROCESS],
        // Auto-transition: financial analysis is done by the document OCR step
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
                // Auto-approve if KYC child approved and KYB child approved (or no KYB)
                rule: `length(childWorkflows.kyc_onboarding_sierra_leone.*[?state == 'approved']) > \`0\` && (childWorkflows.kyb_onboarding_sierra_leone_formal == null && childWorkflows.kyb_onboarding_sierra_leone_informal == null || length(childWorkflows.kyb_onboarding_sierra_leone_formal.*[?state == 'approved'] || childWorkflows.kyb_onboarding_sierra_leone_informal.*[?state == 'approved'] || []) > \`0\`)`,
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
        name: 'loan_document_ocr',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/v1/document/smart-ocr`,
        method: 'POST',
        stateNames: ['loan_document_review'],
        successAction: 'LOAN_DOCS_REVIEWED',
        errorAction: 'LOAN_DOCS_FAILED',
        headers: {
          Authorization: `Bearer {secret.UNIFIED_API_TOKEN}`,
          'Content-Type': 'application/json',
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
                  }
                },
                supportedCountries: ['SL']
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
        name: 'applicant_kyc_child',
        definitionId: kycOnboardingSierraLeoneDefinition.id,
        transformers: [
          {
            transformer: 'jmespath',
            mapping: `{
              entity: {
                type: 'individual',
                id: join('-', ['loan-applicant', entity.id]),
                data: {
                  firstName: entity.data.firstName,
                  lastName: entity.data.lastName,
                  nationalId: entity.data.nationalId,
                  dateOfBirth: entity.data.dateOfBirth,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId
                }
              },
              documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership']
            }`,
          },
        ],
        initEvent: 'start',
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
                id: join('-', ['loan-business', entity.id]),
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
              documents: documents[?category=='business_document' || category=='proof_of_registration' || category=='proof_of_address' || category=='proof_of_location']
            }`,
          },
        ],
        initEvent: 'start',
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
                id: join('-', ['loan-business', entity.id]),
                data: {
                  businessName: entity.data.businessName,
                  businessType: entity.data.businessType,
                  phoneNumber: entity.data.phoneNumber,
                  email: entity.data.email,
                  address: entity.data.businessAddress || entity.data.address,
                  country: 'SL',
                  tenantId: entity.data.tenantId,
                  projectId: entity.data.projectId,
                  additionalInfo: {
                    owner: {
                      firstName: entity.data.firstName,
                      lastName: entity.data.lastName,
                      nationalId: entity.data.nationalId,
                      dateOfBirth: entity.data.dateOfBirth,
                      phoneNumber: entity.data.phoneNumber,
                      documents: documents[?category=='proof_of_identity' || category=='proof_of_identity_ownership']
                    }
                  }
                }
              },
              documents: documents[?category=='proof_of_address' || category=='proof_of_location' || type=='market_association_card']
            }`,
          },
        ],
        initEvent: 'start',
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
            mapping: '[entity.data]', // Single element array
          },
        ],
        successAction: 'KYC_CHILD_DONE',
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
            mapping: '[entity.data]',
          },
        ],
        successAction: 'KYB_CHILD_DONE',
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
            mapping: '[entity.data]',
          },
        ],
        successAction: 'KYB_CHILD_DONE',
        errorAction: 'KYB_CHILD_FAILED',
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
        deliverEvent: 'KYC_CHILD_DONE',
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
        deliverEvent: 'KYB_CHILD_DONE',
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
        deliverEvent: 'KYB_CHILD_DONE',
      },
    ],
    createCollectionFlowToken: false, // LoanCube submits all data upfront — no collection flow needed
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
            country: Type.Optional(Type.String({ default: 'SL' })),
            address: Type.Optional(Type.Object({
              line1: Type.Optional(Type.String()),
              city: Type.Optional(Type.String()),
              district: Type.Optional(Type.String()),
              country: Type.Optional(Type.String({ default: 'SL' })),
            })),
            // Business info (if applicable)
            businessName: Type.Optional(Type.String()),
            businessType: Type.Optional(Type.String()),
            registrationNumber: Type.Optional(Type.String()),
            taxIdNumber: Type.Optional(Type.String()),
            businessAddress: Type.Optional(Type.Object({
              line1: Type.Optional(Type.String()),
              city: Type.Optional(Type.String()),
              district: Type.Optional(Type.String()),
              market: Type.Optional(Type.String()),
              country: Type.Optional(Type.String({ default: 'SL' })),
            })),
            directors: Type.Optional(Type.Array(Type.Any())),
            // Loan application reference
            loanApplicationId: Type.Optional(Type.String()),
            loanAmount: Type.Optional(Type.Number()),
            loanPurpose: Type.Optional(Type.String()),
            loanTerm: Type.Optional(Type.Number()),
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
