import { stepStatusToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import { IProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  TCollectionFlowStep,
} from '@ballerine/common';
import { CollectionFlowStepItem } from './components/CollectionFlowStepItem';

export class CollectionFlowProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'collection-flow';

  constructor(public readonly workflow: TWorkflowById) {}

  buildItems() {
    return this.getSteps().map(step => {
      return {
        text: (
          <CollectionFlowStepItem
            leftIcon={this.getCollectionFlowStatus(step.stepName)}
            step={step}
            workflow={this.workflow}
          />
        ),
        leftIcon: undefined,
      };
    });
  }

  getReadableName(): string {
    return 'Collection Flow';
  }

  private getSteps(): TCollectionFlowStep[] {
    const collectionFlowState = getCollectionFlowState(this.workflow?.context || {});

    if (!collectionFlowState?.steps?.length) {
      return [];
    }

    return collectionFlowState.steps;
  }

  private getCollectionFlowStatus(step: string) {
    const collectionFlowState = getCollectionFlowState(this.workflow?.context || {});
    const stepItem = collectionFlowState?.steps?.find(s => s.stepName === step);

    if (!stepItem) {
      return stepStatusToIcon[CollectionFlowStepStatesEnum.idle];
    }

    const completedStates = [
      CollectionFlowStepStatesEnum.revised,
      CollectionFlowStepStatesEnum.completed,
    ];

    if (completedStates.includes(stepItem?.state as keyof typeof CollectionFlowStepStatesEnum)) {
      return stepStatusToIcon[CollectionFlowStepStatesEnum.completed];
    }

    if (stepItem?.state === CollectionFlowStepStatesEnum.revision) {
      return stepStatusToIcon[CollectionFlowStepStatesEnum.revision];
    }

    return stepStatusToIcon[CollectionFlowStepStatesEnum.inProgress];
  }
}
