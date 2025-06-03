import { CollectionFlowStepStatesEnum } from '@ballerine/common';
import { stepStatusToIcon } from '../../../constants';
import { TCollectionFlowStateStep } from '@/domains/collection-flow/schemas';

export const getCollectionFlowStatus = (steps: TCollectionFlowStateStep[], stepName: string) => {
  const stepItem = steps?.find(s => s.stepName === stepName);

  if (!stepItem) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.idle];
  }

  const completedStates = [
    CollectionFlowStepStatesEnum.revised,
    CollectionFlowStepStatesEnum.completed,
  ];

  if (stepItem?.state && completedStates.includes(stepItem?.state)) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.completed];
  }

  if (stepItem?.state === CollectionFlowStepStatesEnum.revision) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.revision];
  }

  if (stepItem?.state === CollectionFlowStepStatesEnum.edit) {
    return stepStatusToIcon[CollectionFlowStepStatesEnum.edit];
  }

  return stepStatusToIcon[CollectionFlowStepStatesEnum.inProgress];
};
