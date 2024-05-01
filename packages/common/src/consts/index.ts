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
  FLAGGED: 'flagged',
  DISMISSED: 'dismissed',
} as const;

export const StateTags = [
  StateTag.APPROVED,
  StateTag.REJECTED,
  StateTag.RESOLVED,
  StateTag.REVISION,
  StateTag.MANUAL_REVIEW,
  StateTag.PENDING_PROCESS,
  StateTag.COLLECTION_FLOW,
  StateTag.RESOLVED,
  StateTag.FAILURE,
  StateTag.DATA_ENRICHMENT,
  StateTag.FLAGGED,
  StateTag.DISMISSED,
] as const satisfies ReadonlyArray<(typeof StateTag)[keyof typeof StateTag]>;

export const CommonWorkflowEvent = {
  START: 'START',
  CASE_REVIEWED: 'CASE_REVIEWED',
  RETURN_TO_REVIEW: 'RETURN_TO_REVIEW',
  RESUBMITTED: 'RESUBMITTED',
  REJECT: 'reject',
  APPROVE: 'approve',
  REVISION: 'revision',
  RESOLVE: 'resolve',
  FLAG: 'flag',
  DISMISS: 'dismiss',
} as const;

export const CommonWorkflowStates = {
  IDLE: 'idle',
  MANUAL_REVIEW: 'manual_review',
  REJECTED: 'rejected',
  APPROVED: 'approved',
  RESOLVED: 'resolved',
  REVISION: 'revision',
  FLAGGED: 'flagged',
  DISMISSED: 'dismissed',
} as const;

export type TStateTag = (typeof StateTags)[number];

export const WorkflowDefinitionVariant = {
  WEBSITE_MONITORING: 'WEBSITE_MONITORING',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
  KYB: 'KYB',
  KYB_WITH_ASSOCIATED_COMPANIES: 'KYB_WITH_ASSOCIATED_COMPANIES',
  KYC: 'KYC',
  DEFAULT: 'DEFAULT',
  ONGOING: 'ONGOING',
} as const;

export type TStateTags = typeof StateTags;

export const ProcessStatus = {
  DEFAULT: 'DEFAULT',
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELED: 'CANCELED',
} as const;

export const ProcessStatuses = [
  ProcessStatus.IDLE,
  ProcessStatus.IN_PROGRESS,
  ProcessStatus.SUCCESS,
  ProcessStatus.ERROR,
  ProcessStatus.CANCELED,
] as const satisfies ReadonlyArray<(typeof ProcessStatus)[keyof typeof ProcessStatus]>;

export type TProcessStatus = (typeof ProcessStatuses)[number];

export type TProcessStatuses = typeof ProcessStatuses;

export const UnifiedApiReason = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const;

export const UnifiedApiReasons = [
  UnifiedApiReason.NOT_IMPLEMENTED,
] as const satisfies ReadonlyArray<(typeof UnifiedApiReason)[keyof typeof UnifiedApiReason]>;

export type TUnifiedApiReason = (typeof UnifiedApiReasons)[number];

export type TUnifiedApiReasons = typeof UnifiedApiReasons;

export const WorkflowDefinitionConfigThemeEnum = {
  KYC: 'kyc',
  KYB: 'kyb',
  DOCUMENTS_REVIEW: 'documents-review',
} as const;

export const WorkflowDefinitionConfigThemes = [
  WorkflowDefinitionConfigThemeEnum.KYB,
  WorkflowDefinitionConfigThemeEnum.KYC,
  WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW,
] as const satisfies ReadonlyArray<
  (typeof WorkflowDefinitionConfigThemeEnum)[keyof typeof WorkflowDefinitionConfigThemeEnum]
>;

export type TWorkflowDefinitionConfigTheme = (typeof WorkflowDefinitionConfigThemes)[number];
