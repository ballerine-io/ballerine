import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { resolveTitleToTags } from './helpers/resolve-title-to-tags';
import { resolveIconToTags } from './helpers/resolve-icon-to-tags';

interface IUseMerchantMonitoringTrackerItemsParams {
  workflowTags: TWorkflowById['tags'];
}

export const useMerchantMonitoringTrackerItems = ({
  workflowTags,
}: IUseMerchantMonitoringTrackerItemsParams) => {
  const items = useMemo(
    () => [
      {
        text: resolveTitleToTags(workflowTags || []),
        leftIcon: resolveIconToTags(workflowTags || []),
      },
    ],
    [workflowTags],
  );

  return items;
};
