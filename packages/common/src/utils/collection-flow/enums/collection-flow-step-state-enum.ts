export const CollectionFlowStepStatesEnum = {
  idle: 'idle',
  inProgress: 'inProgress',
  completed: 'completed',
  revision: 'revision',
  revised: 'revised',
  edit: 'edit',
} as const;

export type CollectionFlowStepStates =
  (typeof CollectionFlowStepStatesEnum)[keyof typeof CollectionFlowStepStatesEnum];
