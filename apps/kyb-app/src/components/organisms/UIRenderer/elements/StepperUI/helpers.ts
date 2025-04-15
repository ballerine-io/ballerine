import { CollectionFlowStepStatesEnum } from '@ballerine/common';

import { UIPage } from '@/domains/collection-flow';
import { TCollectionFlowStep } from '@ballerine/common';

export const computeStepStatus = ({
  page,
  steps,
}: {
  page: UIPage;
  steps: TCollectionFlowStep[];
}) => {
  const step = steps.find(step => step.stepName === page.stateName);

  if (step?.state === CollectionFlowStepStatesEnum.revision) {
    return 'warning';
  }

  if (step?.state === CollectionFlowStepStatesEnum.edit) {
    return 'edit';
  }

  const isCompleted = [
    step?.state === CollectionFlowStepStatesEnum.completed,
    step?.isCompleted,
    step?.state === CollectionFlowStepStatesEnum.revised,
  ].some(Boolean);

  if (isCompleted) {
    return 'completed';
  }

  return 'idle';
};
