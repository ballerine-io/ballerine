import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStatusesEnum,
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
} from '@ballerine/common';

export const updateStateForEditing = (workflowContext: TWorkflowById['context']) => {
  workflowContext = structuredClone(workflowContext);
  const collectionFlowState = getCollectionFlowState(workflowContext);

  if (!collectionFlowState) {
    throw new Error('Collection flow state not found');
  }

  collectionFlowState.status = CollectionFlowStatusesEnum.edit;
  collectionFlowState.steps = collectionFlowState.steps?.map(step => ({
    ...step,
    state: CollectionFlowStepStatesEnum.edit,
  }));

  return workflowContext;
};
