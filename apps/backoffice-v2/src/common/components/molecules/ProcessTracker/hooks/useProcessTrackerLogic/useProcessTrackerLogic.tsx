import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  pluginsWhiteList,
  ProcessStatus,
  processStatusToIcon,
  tagToAccordionCardItem,
} from '@/common/components/molecules/ProcessTracker/constants';
import { titleCase } from 'string-ts';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const useProcessTrackerLogic = ({
  tags,
  plugins,
  context,
}: {
  tags: TWorkflowById['tags'];
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  context: TWorkflowById['context'];
}) => {
  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);
  const tag = useMemo(
    () => tags?.find(tag => tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]),
    [tags],
  );
  const subitems = useMemo(() => {
    return plugins
      ?.filter(({ displayName }) =>
        pluginsWhiteList.includes(displayName as (typeof pluginsWhiteList)[number]),
      )
      ?.map(({ displayName, status }) => ({
        text: displayName,
        leftIcon: processStatusToIcon[status],
      }));
  }, [plugins]);
  const steps = Object.keys(context?.flowConfig?.stepsProgress ?? {})?.sort((a, b) => {
    return (
      (context?.flowConfig?.stepsProgress?.[a]?.number ?? 0) -
      (context?.flowConfig?.stepsProgress?.[b]?.number ?? 0)
    );
  });
  const collectionFlowSubitems = useMemo(() => {
    return steps?.map(step => {
      const getCollectionFlowStatus = (step: string) => {
        if (context?.flowConfig?.stepsProgress?.[step]?.isCompleted) {
          return processStatusToIcon[ProcessStatus.SUCCESS];
        }

        return processStatusToIcon[ProcessStatus.IDLE];
      };

      return {
        text: titleCase(step),
        leftIcon: getCollectionFlowStatus(step),
      };
    });
  }, [context?.flowConfig]);

  useEffect(() => {
    onValueChange(tagToAccordionCardItem[tag as keyof typeof tagToAccordionCardItem]);
  }, []);

  return {
    uncollapsedItemValue,
    onValueChange,
    subitems,
    collectionFlowSubitems,
  };
};
