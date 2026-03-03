import { PrismaClient } from '@prisma/client';
import { defaultContextSchema, StateTag, WorkflowDefinitionVariant } from '@ballerine/common';
import { Type } from '@sinclair/typebox';
import { generateBaseCaseLevelStates } from '../generate-base-case-level-states';

export const loanDocumentsReviewSierraLeoneDefinition = {
  id: 'loan_documents_review_sierra_leone',
  name: 'loan_documents_review_sierra_leone',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'loan_documents_review_sierra_leone_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          start: 'manual_review',
          start_with_documents: 'manual_review',
        },
      },
      ...generateBaseCaseLevelStates('manual_review'),
    },
  },
  extensions: {
    apiPlugins: [],
    childWorkflowPlugins: [],
    commonPlugins: [],
  },
  config: {
    workflowLevelResolution: true,
    language: 'en',
    supportedLanguages: ['en'],
    isCaseOverviewEnabled: true,
    isCaseRiskOverviewEnabled: true,
    isDocumentsV2: true,
    isDocumentTrackerEnabled: true,
    theme: { type: 'documents-review' },
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
            firstName: Type.Optional(Type.String()),
            lastName: Type.Optional(Type.String()),
            email: Type.Optional(Type.String()),
            nationalId: Type.Optional(Type.String()),
            loanApplicationId: Type.Optional(Type.String()),
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

export const generateLoanDocumentsReviewSierraLeone = async (prismaClient: PrismaClient) => {
  const { id, ...rest } = loanDocumentsReviewSierraLeoneDefinition;

  return await prismaClient.workflowDefinition.upsert({
    where: { id },
    update: rest,
    create: { id, ...rest },
  });
};
