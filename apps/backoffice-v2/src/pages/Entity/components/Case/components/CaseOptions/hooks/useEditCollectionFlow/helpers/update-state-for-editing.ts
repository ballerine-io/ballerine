import { TCollectionFlowState } from '@/domains/collection-flow/schemas';
import { CollectionFlowStatusesEnum, CollectionFlowStepStatesEnum } from '@ballerine/common';

export const updateStateForEditing = ({
  collectionFlowState,
  steps,
}: {
  collectionFlowState: TCollectionFlowState;
  steps: 'all' | string[];
}) => {
  const collectionFlowStateClone = structuredClone(collectionFlowState);

  collectionFlowStateClone.status = CollectionFlowStatusesEnum.edit;
  collectionFlowStateClone.steps = collectionFlowState?.steps?.map(step => {
    if (steps === 'all' || steps.includes(step.stepName)) {
      return {
        ...step,
        state: CollectionFlowStepStatesEnum.edit,
      };
    }

    return step;
  });

  return collectionFlowStateClone;
};
