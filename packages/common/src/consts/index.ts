export const StateTag = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
  REVISION: 'revision',
  MANUAL_REVIEW: 'manual_review',
  PENDING_PROCESS: 'pending_process',
  COLLECTION_FLOW: 'collection_flow',
  FAILURE: 'failure',
  DATA_ENRICHMENT: 'data_enrichment',
} as const;

export const StateTags = [
  StateTag.APPROVED,
  StateTag.REJECTED,
  StateTag.REVISION,
  StateTag.MANUAL_REVIEW,
  StateTag.PENDING_PROCESS,
  StateTag.COLLECTION_FLOW,
  StateTag.RESOLVED,
  StateTag.FAILURE,
] as const;

export const CommonWorkflowEvent = {
  TASK_REVIEWED: 'TASK_REVIEWED',
  CASE_REVIEWED: 'CASE_REVIEWED',
  RETURN_TO_REVIEW: 'RETURN_TO_REVIEW',
  RESUBMITTED: 'RESUBMITTED',
  REJECT: 'reject',
  APPROVE: 'approve',
  REVISION: 'revision',
  RESOLVE: 'resolve',
} as const;

export const CommonWorkflowStates = {
  MANUAL_REVIEW: 'manual_review',
  REJECTED: 'rejected',
  APPROVED: 'approved',
  RESOLVED: 'resolved',
  REVISION: 'revision',
} as const;

export type TStateTag = (typeof StateTags)[number];

export const WorkflowDefinitionVariant = {
  WEBSITE_MONITORING: 'WEBSITE_MONITORING',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
  KYB: 'KYB',
  KYB_WITH_ASSOCIATED_COMPANIES: 'KYB_WITH_ASSOCIATED_COMPANIES',
  KYC: 'KYC',
  DEFAULT: 'DEFAULT',
} as const;

export type TStateTags = typeof StateTags;
