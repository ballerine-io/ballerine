export const CollectionFlowEvents = {
  USER_EXITED: 'user-exited',
  FLOW_COMPLETED: 'flow-completed',
  FLOW_FAILED: 'flow-failed',
} as const;

export type TCollectionFlowEvents =
  (typeof CollectionFlowEvents)[keyof typeof CollectionFlowEvents];
