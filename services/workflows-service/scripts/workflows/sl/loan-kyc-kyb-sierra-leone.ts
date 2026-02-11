import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { env } from '../../../src/env';

/**
 * Loan Application Verification Workflow for Sierra Leone.
 *
 * Triggered by LoanCube when a loan application is submitted.
 *
 * This workflow is intentionally BACKEND-ONLY (no collection flow / no webview).
 * KYC and KYB are expected to be handled upstream (Android webview + business gate)
 * before the customer is eligible to submit a loan.
 *
 * What this workflow does:
 * - Persist and display the submitted loan + business context in Ballerine
 * - Run loan document OCR/extraction (bank statements, income records, etc.)
 * - Auto-approve when OCR succeeds with high confidence; otherwise route to manual review
 */

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
          start: 'loan_document_review',
          // Fired by LoanCube when additional loan documents are uploaded after submission.
          // Allows re-running OCR even if the workflow hasn't reached manual_review yet.
          LOAN_DOCS_UPDATED: 'loan_document_review',
        },
      },
      loan_document_review: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          LOAN_DOCS_REVIEWED: [{ target: 'risk_evaluation' }],
          LOAN_DOCS_FAILED: [{ target: 'manual_review' }],
          // Re-run OCR/extraction when LoanCube re-syncs documents into the runtime.
          LOAN_DOCS_UPDATED: [{ target: 'loan_document_review' }],
        },
        // Auto-approve if no loan documents.
        //
        // Rationale: this workflow is used to stage/approve loan documents (OCR + operator review)
        // when documents are attached to the loan. If no documents were submitted, there is
        // nothing for Ballerine to verify here, so we allow the loan to proceed.
        always: [
          {
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                rule: "length(documents[?category=='financial_information' || category=='proof_of_employment']) == `0`",
              },
            },
          },
        ],
      },
      risk_evaluation: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          // If documents are updated while we're evaluating the OCR results,
          // bounce back through OCR so the decision is based on the latest uploads.
          LOAN_DOCS_UPDATED: 'loan_document_review',
        },
        always: [
          {
            target: 'approved',
            cond: {
              type: 'jmespath',
              options: {
                // Auto-approve only when ALL OCR results succeeded and meet the confidence threshold.
                // Unified API smart-ocr returns: { results: [{ success, confidence, ... }] }
                rule: `length(pluginsOutput.loan_document_ocr.results) > \`0\` && length(pluginsOutput.loan_document_ocr.results[?success != \`true\` || (confidence || \`0\`) < \`0.7\` || error != null]) == \`0\``,
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
          // Fired by LoanCube when additional loan documents are uploaded after submission.
          // Sends the runtime back through OCR/extraction so operators see updated results.
          LOAN_DOCS_UPDATED: 'loan_document_review',
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
        name: 'loan_document_ocr',
        pluginKind: 'api',
        url: `${env.UNIFIED_API_URL}/api/v1/document/smart-ocr`,
        method: 'POST',
        stateNames: ['loan_document_review'],
        successAction: 'LOAN_DOCS_REVIEWED',
        errorAction: 'LOAN_DOCS_FAILED',
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
    childWorkflowPlugins: [],
    commonPlugins: [],
  },
  config: {
    createCollectionFlowToken: false, // LoanCube submits all data upfront — no collection flow needed
    language: 'en',
    // A customer can submit multiple loan applications; each must create its own runtime.
    // Without this, Ballerine will update an existing active runtime for the same entity+workflowDefinitionId.
    allowMultipleActiveWorkflows: true,
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
