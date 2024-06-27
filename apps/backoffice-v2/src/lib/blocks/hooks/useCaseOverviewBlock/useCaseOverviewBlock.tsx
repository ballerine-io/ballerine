import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React from 'react';
import { CaseOverview } from '@/pages/Entity/components/Case/components/CaseOverview/CaseOverview';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';

export const useCaseOverviewBlock = () => {
  return createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: <CaseOverview processes={DEFAULT_PROCESS_TRACKER_PROCESSES} />,
    })
    .build();
};
