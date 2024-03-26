import { tagToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  ProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export class UBOFlowsProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'ubos';

  constructor(readonly workflow: TWorkflowById) {}

  buildItems(): ProcessTrackerItem[] {
    return this.getChildWorkflows().map(({ context, tags }) => {
      return {
        text: `${valueOrNA(context?.entity?.data?.firstName)} ${valueOrNA(
          context?.entity?.data?.lastName,
        )}`,
        leftIcon: this.getUboFlowStatus(tags),
      };
    });
  }

  getReadableName(): string {
    return 'UBO flows';
  }

  private getUboFlowStatus(tags: TWorkflowById['tags']) {
    const tag = tags?.find(tag => tagToIcon[tag as keyof typeof tagToIcon]);

    if (!tag) {
      return tagToIcon.DEFAULT;
    }

    return tagToIcon[tag as keyof typeof tagToIcon];
  }

  private getChildWorkflows() {
    return this.workflow?.childWorkflows || [];
  }
}
