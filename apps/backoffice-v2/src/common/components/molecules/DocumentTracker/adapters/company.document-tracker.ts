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
    const steps = this.workflow?.context?.collectionFlow?.state?.steps;

    if (!steps?.length) return [];

    return steps.map(step => step.stepName);
  }

  private getCollectionFlowStatus(step: string) {
    const stepItem = this.workflow?.context?.collectionFlow?.state?.steps?.find(
      s => s.stepName === step,
    );

    if (!stepItem) return processStatusToIcon[ProcessStatus.IDLE];

    if (stepItem?.isCompleted) {
      return processStatusToIcon[ProcessStatus.SUCCESS];
    }

    return processStatusToIcon[ProcessStatus.IDLE];
  }
}
