import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  pluginsWhiteList,
  ProcessStatus,
  processStatusToIcon,
  tagToAccordionCardItem,
  tagToIcon,
} from '@/common/components/molecules/ProcessTracker/constants';
import { titleCase } from 'string-ts';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';

export const useProcessTrackerLogic = ({
  tags,
  plugins,
  context,
  childWorkflows,
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
  childWorkflows: TWorkflowById['childWorkflows'];
}) => {
  const [uncollapsedItemValue, setUncollapsedItemValue] = useState<string>();
  const onValueChange = useCallback((value: string) => {
    setUncollapsedItemValue(value);
  }, []);
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
  const kycChildWorkflows = useMemo(() => {
    return childWorkflows?.filter(
      childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
    );
  }, [childWorkflows]);
  const getCollectionFlowStatus = useCallback(
    (step: string) => {
      if (context?.flowConfig?.stepsProgress?.[step]?.isCompleted) {
        return processStatusToIcon[ProcessStatus.SUCCESS];
      }

      return processStatusToIcon[ProcessStatus.IDLE];
    },
    [context?.flowConfig?.stepsProgress],
  );
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
      ?.map(({ displayName, status }) => ({
        text: displayName,
        leftIcon: processStatusToIcon[status],
      }));
  }, [plugins]);

  const getUboFlowStatus = useCallback((tags: TWorkflowById['tags']) => {
    const tag = tags?.find(tag => tagToIcon[tag as keyof typeof tagToIcon]);

    if (!tag) {
      return tagToIcon.DEFAULT;
    }

    return tagToIcon[tag as keyof typeof tagToIcon];
  }, []);
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
  }, []);

  return {
    uncollapsedItemValue,
    onValueChange,
    thirdPartyProcessesSubitems,
    collectionFlowSubitems,
    uboFlowsSubitems,
  };
};
