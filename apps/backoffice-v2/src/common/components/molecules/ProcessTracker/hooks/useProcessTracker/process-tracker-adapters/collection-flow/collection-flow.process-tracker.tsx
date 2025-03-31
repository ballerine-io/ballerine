import { stepStatusToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import { IProcessTracker } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  CollectionFlowStepStatesEnum,
  getCollectionFlowState,
  TCollectionFlowStep,
} from '@ballerine/common';
import { CollectionFlowStepItem } from './components/CollectionFlowStepItem';
import { CollectionFlowProcessTitle } from './components/CollectionFlowStepItem/components/CollectionFlowProcessTitle';

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

  getTitle() {
    return <CollectionFlowProcessTitle workflow={this.workflow} />;
  }

  getItemParams(): object {
    return {
      accordionTriggerProps: {
        className: 'hover:no-underline',
      },
    };
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

    if (stepItem?.state && completedStates.includes(stepItem?.state)) {
      return stepStatusToIcon[CollectionFlowStepStatesEnum.completed];
    }

    if (stepItem?.state === CollectionFlowStepStatesEnum.revision) {
      return stepStatusToIcon[CollectionFlowStepStatesEnum.revision];
    }

    return stepStatusToIcon[CollectionFlowStepStatesEnum.inProgress];
  }
}
