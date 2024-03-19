import {
  pluginsWhiteList,
  processStatusToIcon,
} from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  IProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/process-tracker-adapters/process-tracker.abstract';
import { TPlugin } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ProcessStatus } from '@ballerine/common';

export class ThirdPartyProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'third-party';

  constructor(readonly workflow: TWorkflowById, readonly plugins?: TPlugin[]) {}

  buildItems(): IProcessTrackerItem[] {
    return (
      this.plugins
        ?.filter(({ name }) => pluginsWhiteList.includes(name))
        ?.map(({ displayName, name }) => {
          const pluginStatus = this.getPluginByName(name)?.status ?? ProcessStatus.DEFAULT;

          return {
            text:
              pluginStatus === ProcessStatus.CANCELED ? (
                <span className={`text-slate-400/40 line-through`}>{displayName}</span>
              ) : (
                displayName
              ),
            leftIcon: processStatusToIcon[pluginStatus as keyof typeof processStatusToIcon],
          };
        }) || []
    );
  }

  getReadableName(): string {
    return '3rd party processes';
  }

  private getPluginByName(name: string) {
    let plugin: NonNullable<TWorkflowById['context']['pluginsOutput']>[string];

    Object.keys(this.workflow?.context?.pluginsOutput ?? {})?.forEach(key => {
      if (this.workflow?.context?.pluginsOutput?.[key]?.name !== name) {
        return;
      }

      plugin = this.workflow?.context?.pluginsOutput?.[key];
    });

    return plugin;
  }
}
