import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { getUBOFlowStatusByTags } from './helpers/get-ubo-flow-status-by-tags';
import { valueOrNA } from '@ballerine/common';

export const useUBOFlowsTrackerItems = (childWorkflows: TWorkflowById['childWorkflows']) => {
  const items = useMemo(
    () =>
      childWorkflows?.map(({ context, tags }) => {
        return {
          text: `${valueOrNA(context?.entity?.data?.firstName)} ${valueOrNA(
            context?.entity?.data?.lastName,
          )}`,
          leftIcon: getUBOFlowStatusByTags(tags),
        };
      }) || [],
    [childWorkflows],
  );

  return items;
};
