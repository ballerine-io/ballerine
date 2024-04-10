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
    return Object.keys(this.workflow?.context?.flowConfig?.stepsProgress ?? {})?.sort((a, b) => {
      return (
        (this.workflow?.context?.flowConfig?.stepsProgress?.[a]?.number ?? 0) -
        (this.workflow?.context?.flowConfig?.stepsProgress?.[b]?.number ?? 0)
      );
    });
  }

  private getCollectionFlowStatus(step: string) {
    if (this.workflow?.context?.flowConfig?.stepsProgress?.[step]?.isCompleted) {
      return processStatusToIcon[ProcessStatus.SUCCESS];
    }

    return processStatusToIcon[ProcessStatus.IDLE];
  }
}
