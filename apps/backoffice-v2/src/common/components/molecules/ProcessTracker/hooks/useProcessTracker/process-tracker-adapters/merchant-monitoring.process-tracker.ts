import { Icon, tagToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  ProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag } from '@ballerine/common';

export class MerchantMonitoringProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'merchant-monitoring';

  constructor(public readonly workflow: TWorkflowById) {}

  buildItems(): ProcessTrackerItem[] {
    return [
      {
        text: this.resolveTitleToTags(this.workflow?.tags || []),
        leftIcon: this.getIconKeyByState(this.workflow?.tags || []),
      },
    ];
  }

  getReadableName(): string {
    return 'Merchant Monitoring';
  }

  private resolveTitleToTags(tags?: string[]) {
    if (tags?.includes(StateTag.PENDING_PROCESS)) return 'Risk Analysis';

    if (tags?.includes(StateTag.FAILURE)) return 'Process failed.';

    if (tags?.includes(StateTag.MANUAL_REVIEW)) return 'Manual Review';

    if (tags?.includes(StateTag.REJECTED)) return 'Rejected';

    if (tags?.includes(StateTag.APPROVED)) return 'Approved';
  }

  private getIconKeyByState(tags: string[]): JSX.Element {
    return tagToIcon[tags[0] as keyof typeof tagToIcon]
      ? tagToIcon[tags[0] as keyof typeof tagToIcon]
      : Icon.INDICATOR;
  }
}
