import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TCollectionFlowStep } from '@ballerine/common';
import { useMemo } from 'react';
import { CollectionFlowStepItem } from '../../components/CollectionFlowStepItem';
import { getCollectionFlowStatus } from '../../helpers/get-collection-flow-status';

interface IUseCollectionFlowTrackerItemsParams {
  steps: TCollectionFlowStep[];
  workflow: TWorkflowById;
}

export const useCollectionFlowTrackerItems = ({
  steps,
  workflow,
}: IUseCollectionFlowTrackerItemsParams) => {
  const items = useMemo(
    () =>
      steps.map(step => {
        return {
          text: (
            <CollectionFlowStepItem
              leftIcon={getCollectionFlowStatus(workflow.context, step.stepName)}
              step={step}
              workflow={workflow}
            />
          ),
          leftIcon: undefined,
        };
      }),
    [steps, workflow],
  );

  return items;
};
