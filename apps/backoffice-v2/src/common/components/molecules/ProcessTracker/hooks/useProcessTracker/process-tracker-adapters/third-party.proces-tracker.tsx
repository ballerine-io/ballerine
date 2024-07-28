import {
  pluginsWhiteList,
  processStatusToIcon,
} from '@/common/components/molecules/ProcessTracker/constants';
import {
  IProcessTracker,
  ProcessTrackerItem,
} from '@/common/components/molecules/ProcessTracker/hooks/useProcessTracker/process-tracker-adapters/process-tracker.abstract';
import { TPlugin } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ProcessStatus } from '@ballerine/common';

export class ThirdPartyProcessTracker implements IProcessTracker {
  PROCESS_NAME = 'third-party';

  constructor(public readonly workflow: TWorkflowById, public readonly plugins?: TPlugin[]) {}

  buildItems(): ProcessTrackerItem[] {
    return (
      this.plugins
        ?.filter(({ name }) => pluginsWhiteList.includes(name as (typeof pluginsWhiteList)[number]))
        ?.map(({ displayName, name }) => {
          const plugin = this.getPluginByName(name);
          const pluginStatus = plugin?.status ?? ProcessStatus.DEFAULT;

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
