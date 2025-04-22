import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TWorkflowPlugin } from '../../../../components/Tracker/types';
import { useMemo } from 'react';
import { pluginsWhiteList } from '../../consts';
import { getPluginByName } from './helpers/get-plugin-by-name';
import { ProcessStatus } from '@ballerine/common';
import { processStatusToIcon } from '../../../../constants';

interface IUseThirdPartyTrackerItemsParams {
  workflowPluginsOutput: TWorkflowById['context']['pluginsOutput'];
  workflowPlugins: TWorkflowPlugin[];
}

export const useThirdPartyTrackerItems = ({
  workflowPluginsOutput,
  workflowPlugins,
}: IUseThirdPartyTrackerItemsParams) => {
  const items = useMemo(
    () =>
      workflowPlugins
        ?.filter(({ name }) => pluginsWhiteList.includes(name as (typeof pluginsWhiteList)[number]))
        ?.map(({ displayName, name }) => {
          const plugin = getPluginByName(name, workflowPluginsOutput);
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
        }) || [],
    [workflowPluginsOutput, workflowPlugins],
  );

  return items;
};
