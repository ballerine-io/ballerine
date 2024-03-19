import { Icon, tagToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  IProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag } from '@ballerine/common';

export class MerchantMonitoringProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'merchant-monitoring';

  constructor(readonly workflow: TWorkflowById) {}

  buildItems(): IProcessTrackerItem[] {
    return [
      {
        text: this.resolveTitleToTags(this.workflow?.tags || []),
        leftIcon: this.getIconKeyByState(this.workflow?.tags || []),
      },
    ];
  }

  getReadableName() {
    return 'Merchant Monitoring';
  }

  private resolveTitleToTags(tags?: string[]) {
    if (tags?.includes(StateTag.PENDING_PROCESS)) return 'Risk Analysis';

    if (tags?.includes(StateTag.FAILURE)) return 'Process failed';

    if (tags?.includes(StateTag.MANUAL_REVIEW)) return 'Manual Review';

    if (tags?.includes(StateTag.REJECTED)) return 'Rejected';

    if (tags?.includes(StateTag.APPROVED)) return 'Approved';
  }

  private getIconKeyByState(tags: string[]) {
    return tagToIcon[tags[0] as keyof typeof tagToIcon]
      ? tagToIcon[tags[0] as keyof typeof tagToIcon]
      : Icon.INDICATOR;
  }
}
