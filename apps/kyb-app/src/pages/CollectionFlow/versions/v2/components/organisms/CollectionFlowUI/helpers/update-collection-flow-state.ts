import { setStepCompletionState } from '@ballerine/common';

import { setCollectionFlowStatus } from '@ballerine/common';

import { CollectionFlowStatusesEnum } from '@ballerine/common';

import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';

export const updateCollectionFlowState = (context: CollectionFlowContext, currentState: string) => {
  const collectionFlow = getCollectionFlowState(context);

  setCollectionFlowStatus(context, CollectionFlowStatusesEnum.inprogress);

  const currentStateIndex = collectionFlow?.steps?.findIndex(
    element => element.stepName === currentState,
  );

  if (currentStateIndex !== -1) {
    setStepCompletionState(context, {
      stepName: currentState,
      completed: true,
    });
  }

  const nextStep = collectionFlow?.steps?.[currentStateIndex! + 1];

  if (nextStep) {
    collectionFlow.currentStep = nextStep.stepName;
  }

  return context;
};
