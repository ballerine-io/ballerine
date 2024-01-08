import { StateTag } from '@ballerine/common';

export const composeChildAssociatedCompanyDefinition = ({
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
            START_ASSOCIATED_COMPANY_KYB: 'pending_associated_kyb_collection_flow',
          },
        },
        pending_associated_kyb_collection_flow: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            COLLECTION_FLOW_FINISHED: [{ target: 'manual_review' }],
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
            COLLECTION_FLOW_FINISHED: 'manual_review',
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
    },
    projectId: projectId,
    isPublic: false,
  };
};
