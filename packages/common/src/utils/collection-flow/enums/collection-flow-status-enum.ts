export const CollectionFlowStatusesEnum = {
  // Collection Flow created but never touched by end user
  pending: 'pending',
  // Collection Flow is in progress
  inprogress: 'inprogress',
  // Collection Flow is approved
  approved: 'approved',
  // Collection Flow is rejected
  rejected: 'rejected',
  // Collection Flow is in revision
  revision: 'revision',
  // Collection Flow failed (by plugins)
  failed: 'failed',
  // Collection Flow is completed (by end user)
  completed: 'completed',
} as const;

export type CollectionFlowStatuses =
  (typeof CollectionFlowStatusesEnum)[keyof typeof CollectionFlowStatusesEnum];
