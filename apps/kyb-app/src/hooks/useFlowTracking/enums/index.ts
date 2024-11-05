export const CollectionFlowEventsEnum = {
  USER_EXITED: 'user-exited',
  FLOW_COMPLETED: 'flow-completed',
  FLOW_FAILED: 'flow-failed',
} as const;

export type CollectionFlowEventsEnum =
  (typeof CollectionFlowEventsEnum)[keyof typeof CollectionFlowEventsEnum];
