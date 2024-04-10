import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ComponentProps, useMemo } from 'react';

export const useProcessTrackerBlock = ({
  workflow,
  plugins,
  processes,
}: ComponentProps<typeof ProcessTracker>) => {
  const block = useMemo(
    () =>
      createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'nodeCell',
          value: <ProcessTracker workflow={workflow} plugins={plugins} processes={processes} />,
        })
        .build(),
    [workflow, plugins, processes],
  );

  return block;
};
