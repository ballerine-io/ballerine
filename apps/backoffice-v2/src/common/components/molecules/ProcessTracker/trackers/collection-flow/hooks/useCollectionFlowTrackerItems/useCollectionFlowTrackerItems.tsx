import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TCollectionFlowStep } from '@ballerine/common';
import { useMemo } from 'react';
import { CollectionFlowStepItem } from '../../components/CollectionFlowStepItem';
import { getCollectionFlowStatus } from '../../helpers/get-collection-flow-status';
import { Skeleton } from '@ballerine/ui';

interface IUseCollectionFlowTrackerItemsParams {
  steps: TCollectionFlowStep[];
  isLoadingSteps: boolean;
  workflow: TWorkflowById;
}

export const useCollectionFlowTrackerItems = ({
  steps,
  workflow,
  isLoadingSteps,
}: IUseCollectionFlowTrackerItemsParams) => {
  const items = useMemo(() => {
    if (!isLoadingSteps && steps.length) {
      return steps.map(step => {
        return {
          text: (
            <CollectionFlowStepItem
              leftIcon={getCollectionFlowStatus(steps, step.stepName)}
              step={step}
              workflow={workflow}
            />
          ),
          leftIcon: undefined,
        };
      });
    }

    if (isLoadingSteps) {
      return Array.from({ length: 3 }).map((_, index) => {
        return {
          text: <Skeleton className="h-4 w-24" />,
          leftIcon: undefined,
        };
      });
    }

    return [
      {
        text: (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">No collection flow steps available</span>
          </div>
        ),
      },
    ];
  }, [steps, workflow, isLoadingSteps]);

  return items;
};
