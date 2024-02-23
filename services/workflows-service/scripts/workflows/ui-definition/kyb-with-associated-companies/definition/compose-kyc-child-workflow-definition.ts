import { StateTag } from '@ballerine/common';

export const composeKycChildWorkflowDefinition = ({
  definitionId,
  definitionName,
  projectId,
}: {
  projectId: string;
  definitionName: string;
  definitionId: string;
}) => {
  return {
    id: definitionId,
    name: definitionName,
    version: 1,
    definitionType: 'statechart-json',
    definition: {
      id: `${definitionId}_v1`,
      predictableActionArguments: true,
      initial: 'idle',
      states: {
        idle: {
          on: {
            START_KYC: 'pending_kyc_flow',
          },
        },
        pending_kyc_flow: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            KYC_DONE: [{ target: 'manual_review' }],
          },
        },
        manual_review: {
          tags: [StateTag.MANUAL_REVIEW],
          on: {
            revision: 'revision',
            approve: 'approved',
          },
        },
        approved: {
          tags: [StateTag.APPROVED],
          type: 'final' as const,
        },
        failed: {
          tags: [StateTag.FAILURE],
          type: 'final' as const,
        },
        revision: {
          tags: [StateTag.REVISION],
          on: {
            KYC_DONE: 'manual_review',
          },
        },
      },
    },
    extensions: {
      apiPlugins: [],
    },
    config: {
      createCollectionFlowToken: true,
      workflowLevelResolution: true,
      isCaseOverviewEnabled: true,
    },
    projectId: projectId,
    isPublic: false,
  };
};
