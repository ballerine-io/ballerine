import { processStatusToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  ProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ProcessStatus } from '@ballerine/common';
import { titleCase } from 'string-ts';

export class CollectionFlowProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'collection-flow';

  constructor(public readonly workflow: TWorkflowById) {}

  buildItems(): ProcessTrackerItem[] {
    return (
      this.getSteps()?.map(step => {
        return {
          text: titleCase(step),
          leftIcon: this.getCollectionFlowStatus(step),
        };
      }) || []
    );
  }

  getReadableName(): string {
    return 'Collection Flow';
  }

  private getSteps() {
    const steps = this.workflow?.context?.collectionFlow?.config?.steps;

    if (!steps?.length) return [];

    // Create a map of stateName to orderNumber for efficient lookup
    const stateOrderMap = new Map(steps.map(step => [step.stateName, step.orderNumber]));

    // Get progress states and sort them by their corresponding orderNumber
    return Object.keys(this.workflow?.context?.collectionFlow?.state?.progress ?? {}).sort(
      (a, b) => {
        const orderA = stateOrderMap.get(a) ?? 0;
        const orderB = stateOrderMap.get(b) ?? 0;

        return orderA - orderB;
      },
    );
  }

  private getCollectionFlowStatus(step: string) {
    if (this.workflow?.context?.collectionFlow?.state?.progress?.[step]?.isCompleted) {
      return processStatusToIcon[ProcessStatus.SUCCESS];
    }

    return processStatusToIcon[ProcessStatus.IDLE];
  }
}
