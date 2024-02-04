import { Icon } from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  ProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/process-tracker-adapters/process-tracker.abstract';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export class MerchantMonitoringProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'merchant-monitoring';

  constructor(readonly workflow: TWorkflowById) {}

  buildItems(): ProcessTrackerItem[] {
    const items: ProcessTrackerItem[] = this.resolveStatusHistoryToState(
      this.workflow?.state as string,
    ).map(state => {
      return {
        text: this.resolveTitleToState(state),
        leftIcon: this.getIconKeyByState(state),
      };
    });
    return items;
  }

  getReadableName(): string {
    return 'Merchant Monitoring';
  }

  private resolveTitleToState(state?: string) {
    if (!state || state === 'idle') return 'Idle';

    if (state === 'report_generation' || state === 'awaiting_report') return 'Risk Analysis';

    if (state === 'failed') return 'Process failed.';

    if (state === 'finish') return 'Process finished.';
  }

  private resolveStatusHistoryToState(state?: string): string[] {
    const statusHistory: string[] = ['idle'];
    if (state === 'report_generation' || state === 'awaiting_report') {
      statusHistory.push(state);
    }

    if (state === 'finish' || state === 'failed') {
      statusHistory.push('awaiting_report');
      statusHistory.push(state);
    }

    return statusHistory;
  }

  private getIconKeyByState(state: string): JSX.Element {
    switch (state) {
      case 'idle':
        return Icon.INDICATOR;
      case 'report_generation':
        return Icon.CLOCK;
      case 'awaiting_report':
        return Icon.CLOCK;
      case 'finish':
        return Icon.CHECK;
      case 'failed':
        return Icon.X;
    }

    return Icon.INDICATOR;
  }
}
