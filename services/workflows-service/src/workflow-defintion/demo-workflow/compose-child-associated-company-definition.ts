import { StateTag } from '@ballerine/common';

export const composeChildAssociatedCompanyDefinition = ({
  definitionId,
  definitionName,
  projectId,
  crossEnvKey,
}: {
  definitionId: string;
  definitionName: string;
  projectId?: string;
  crossEnvKey?: string;
}) => {
  return {
    id: definitionId,
    name: definitionName,
    crossEnvKey,
    version: 1,
    definitionType: 'statechart-json',
    definition: {
      id: `${definitionId}_v1`,
      predictableActionArguments: true,
      initial: 'idle',
      states: {
        idle: {
          on: {
            START_ASSOCIATED_COMPANY_KYB: 'deliver_associated_company_email',
          },
        },
        deliver_associated_company_email: {
          tags: [StateTag.COLLECTION_FLOW],
          on: {
            EMAIL_SENT: [{ target: 'pending_associated_kyb_collection_flow' }],
            EMAIL_FAILURE: [{ target: 'failed' }],
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
            revision: 'deliver_associated_company_revision_email',
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
        deliver_associated_company_revision_email: {
          tags: [StateTag.REVISION],
          on: {
            EMAIL_SENT: [{ target: 'revision' }],
            EMAIL_FAILURE: [{ target: 'failed' }],
          },
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
      apiPlugins: [
        {
          name: 'associated_company_email',
          pluginKind: 'template-email',
          template: 'associated-company-email',
          stateNames: ['deliver_associated_company_email'],
          successAction: 'EMAIL_SENT',
          errorAction: 'EMAIL_FAILURE',
          templateId: 'd-706793b7bef041ee86bf12cf0359e76d',
        },
        {
          name: 'associated_company_revision_email',
          pluginKind: 'template-email',
          template: 'associated-company-email',
          stateNames: ['deliver_associated_company_revision_email'],
          successAction: 'EMAIL_SENT',
          errorAction: 'EMAIL_FAILURE',
          templateId: 'd-90b00303f2654ea491a8e035fc4048c1',
        },
      ],
    },
    config: {
      createCollectionFlowToken: true,
      isCaseOverviewEnabled: true,
    },
    isPublic: !projectId,
    ...(projectId && { projectId }),
  };
};
