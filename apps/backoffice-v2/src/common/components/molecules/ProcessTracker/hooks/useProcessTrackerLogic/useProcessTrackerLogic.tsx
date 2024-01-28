import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  pluginsWhiteList,
  processStatusToIcon,
  tagToAccordionCardItem,
  tagToIcon,
} from '@/common/components/molecules/ProcessTracker/constants';
import { titleCase } from 'string-ts';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { ProcessStatus } from '@ballerine/common';
import { IUseProcessTrackerLogicParams } from '@/common/components/molecules/ProcessTracker/hooks/useProcessTrackerLogic/interfaces';

export const useProcessTrackerLogic = ({
  tags,
  plugins,
  context,
  childWorkflows,
}: IUseProcessTrackerLogicParams) => {
  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);

  const kycChildWorkflows = useMemo(() => {
    return childWorkflows?.filter(
      childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
    );
  }, [childWorkflows]);

  const tag = useMemo(
    () => tags?.find(tag => tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]),
    [tags],
  );
  const steps = useMemo(() => {
    return Object.keys(context?.flowConfig?.stepsProgress ?? {})?.sort((a, b) => {
      return (
        (context?.flowConfig?.stepsProgress?.[a]?.number ?? 0) -
        (context?.flowConfig?.stepsProgress?.[b]?.number ?? 0)
      );
    });
  }, [context?.flowConfig?.stepsProgress]);

  const getCollectionFlowStatus = useCallback(
    (step: string) => {
      if (context?.flowConfig?.stepsProgress?.[step]?.isCompleted) {
        return processStatusToIcon[ProcessStatus.SUCCESS];
      }

      return processStatusToIcon[ProcessStatus.IDLE];
    },
    [context?.flowConfig?.stepsProgress],
  );
  const getPluginByName = useCallback(
    (name: string) => {
      let plugin: NonNullable<TWorkflowById['context']['pluginsOutput']>[string];

      Object.keys(context?.pluginsOutput ?? {})?.forEach(key => {
        if (context?.pluginsOutput?.[key]?.name !== name) {
          return;
        }

        plugin = context?.pluginsOutput?.[key];
      });

      return plugin;
    },
    [context?.pluginsOutput],
  );
  const getUboFlowStatus = useCallback((tags: TWorkflowById['tags']) => {
    const tag = tags?.find(tag => tagToIcon[tag as keyof typeof tagToIcon]);

    if (!tag) {
      return tagToIcon.DEFAULT;
    }

    return tagToIcon[tag as keyof typeof tagToIcon];
  }, []);

  const collectionFlowSubitems = useMemo(() => {
    return steps?.map(step => {
      return {
        text: titleCase(step),
        leftIcon: getCollectionFlowStatus(step),
      };
    });
  }, [getCollectionFlowStatus, steps]);
  const thirdPartyProcessesSubitems = useMemo(() => {
    return plugins
      ?.filter(({ name }) => pluginsWhiteList.includes(name as (typeof pluginsWhiteList)[number]))
      ?.map(({ displayName, name }) => {
        const pluginStatus = getPluginByName(name)?.status ?? ProcessStatus.DEFAULT;

        return {
          text:
            pluginStatus === ProcessStatus.CANCELED ? (
              <span className={`text-slate-400/40 line-through`}>{displayName}</span>
            ) : (
              displayName
            ),
          leftIcon: processStatusToIcon[pluginStatus as keyof typeof processStatusToIcon],
        };
      });
  }, [getPluginByName, plugins]);
  const uboFlowsSubitems = useMemo(() => {
    return kycChildWorkflows?.map(({ context, tags }) => {
      return {
        text: `${valueOrNA(context?.entity?.data?.firstName)} ${valueOrNA(
          context?.entity?.data?.lastName,
        )}`,
        leftIcon: getUboFlowStatus(tags),
      };
    });
  }, [getUboFlowStatus, kycChildWorkflows]);

  useEffect(() => {
    onValueChange(tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]);
  }, [tag]);

  return {
    uncollapsedItemValue,
    onValueChange,
    thirdPartyProcessesSubitems,
    collectionFlowSubitems,
    uboFlowsSubitems,
  };
};
